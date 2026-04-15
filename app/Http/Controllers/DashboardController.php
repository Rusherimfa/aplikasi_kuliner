<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\AdminNotification;
use App\Models\Reservation;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display dashboard based on authenticated user's role.
     */
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $role = $user?->role ?? UserRole::User;
        $team = $this->teamFromRequest($request);
        $newReservationCount = 0;
        $seatingOverview = [];

        if (
            $team &&
            $user &&
            Schema::hasTable('admin_notifications') &&
            in_array($role, [UserRole::Admin, UserRole::SuperAdmin], true)
        ) {
            $newReservationCount = AdminNotification::query()
                ->where('team_id', $team->id)
                ->where('recipient_user_id', $user->id)
                ->where('type', 'reservation_created')
                ->where('is_read', false)
                ->count();
        }

        if ($team) {
            $seatingOverview = $this->seatingOverview($team);
        }

        return Inertia::render($role->dashboardComponent(), [
            'role' => $role->value,
            'roleLabel' => $role->label(),
            'currentTeamId' => $team?->id,
            'currentTeamSlug' => $team?->slug,
            'newReservationCount' => $newReservationCount,
            'seatingOverview' => $seatingOverview,
        ]);
    }

    private function teamFromRequest(Request $request): ?Team
    {
        $team = $request->route('current_team');

        if ($team instanceof Team) {
            return $team;
        }

        if (is_string($team)) {
            return Team::query()->where('slug', $team)->first();
        }

        return null;
    }

    /**
     * Build seating summary for dashboard seat map widget.
     *
     * @return array<int, array<string, mixed>>
     */
    private function seatingOverview(Team $team): array
    {
        $reservedSeatIds = Reservation::query()
            ->where('team_id', $team->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->pluck('table_seat_id')
            ->filter()
            ->map(fn ($seatId) => (int) $seatId)
            ->all();

        return $team->restaurantTables()
            ->with(['seats' => fn ($query) => $query->where('is_active', true)->orderBy('seat_number')])
            ->orderBy('code')
            ->get()
            ->map(function ($table) use ($reservedSeatIds) {
                $totalSeats = $table->seats->count();
                $reservedCount = $table->seats
                    ->filter(fn ($seat) => in_array((int) $seat->id, $reservedSeatIds, true))
                    ->count();

                return [
                    'id' => $table->id,
                    'code' => $table->code,
                    'name' => $table->name,
                    'total_seats' => $totalSeats,
                    'reserved_seats' => $reservedCount,
                    'available_seats' => max($totalSeats - $reservedCount, 0),
                    'seats' => $table->seats->map(fn ($seat) => [
                        'id' => $seat->id,
                        'label' => $seat->label,
                        'is_reserved' => in_array((int) $seat->id, $reservedSeatIds, true),
                    ])->values()->all(),
                ];
            })
            ->values()
            ->all();
    }
}
