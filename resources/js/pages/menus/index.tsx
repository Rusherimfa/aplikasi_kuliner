import { Head, Link, router } from '@inertiajs/react';
import {
    Search,
    Plus,
    Edit,
    Trash2,
    EyeOff,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import * as menus from '@/routes/menus';

// Assuming basic prop types from the controller
interface Menu {
    id: number;
    name: string;
    description: string | null;
    category: string;
    price: string;
    is_available: boolean;
}

interface PageProps {
    menus: {
        data: Menu[];
        current_page: number;
        last_page: number;
        links: any[];
    };
    filters: {
        search?: string;
        category?: string;
    };
    currentTeam: {
        slug: string;
    };
}

export default function MenusIndex({
    menus: paginatedMenus,
    filters,
    currentTeam,
}: PageProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            router.get(
                menus.index(currentTeam.slug),
                { search: searchTerm },
                { preserveState: true },
            );
        }
    };

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(Number(price));
    };

    return (
        <>
            <Head title="Menu Management" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto bg-slate-50/50 p-6 font-['Inter',sans-serif]">
                {/* Header Actions */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Menu Management
                        </h1>
                        <p className="text-sm text-slate-500">
                            Manage your restaurant's offerings, pricing, and
                            availability.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button className="bg-amber-700 text-white shadow-md hover:bg-amber-800">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Item
                        </Button>
                    </div>
                </div>

                <Card className="border-slate-200/60 bg-white shadow-sm">
                    <CardHeader className="flex flex-col items-center justify-between gap-4 pb-4 sm:flex-row">
                        <div>
                            <CardTitle className="text-lg text-slate-900">
                                Menu Items
                            </CardTitle>
                            <CardDescription>
                                A complete list of your restaurant menu.
                            </CardDescription>
                        </div>
                        <div className="flex w-full items-center gap-2 sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    type="search"
                                    placeholder="Search menus..."
                                    className="border-slate-200 bg-slate-50 pl-9"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    onKeyDown={handleSearch}
                                />
                            </div>
                            <Button
                                variant="outline"
                                className="shrink-0 border-slate-200 bg-white text-slate-600"
                            >
                                Filter
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-hidden rounded-md border border-slate-200">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">
                                            Item Name
                                        </th>
                                        <th className="px-6 py-3 font-medium">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-right font-medium">
                                            Price
                                        </th>
                                        <th className="px-6 py-3 text-center font-medium">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {paginatedMenus.data.length > 0 ? (
                                        paginatedMenus.data.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="transition-colors hover:bg-slate-50/80"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-slate-900">
                                                        {item.name}
                                                    </div>
                                                    <div
                                                        className="mt-0.5 line-clamp-1 max-w-[200px] text-xs text-slate-500"
                                                        title={
                                                            item.description ||
                                                            ''
                                                        }
                                                    >
                                                        {item.description ||
                                                            'No description provided'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge
                                                        variant="outline"
                                                        className="border-slate-200 bg-slate-50 font-normal text-slate-600"
                                                    >
                                                        {item.category}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right font-medium text-slate-900">
                                                    {formatPrice(item.price)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {item.is_available ? (
                                                        <Badge className="border-0 bg-emerald-100 font-normal text-emerald-800 hover:bg-emerald-100">
                                                            Available
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="border-0 bg-rose-100 font-normal text-rose-800 hover:bg-rose-100">
                                                            Unavailable
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-slate-400 hover:text-amber-700"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-slate-400 hover:text-slate-900"
                                                        >
                                                            <EyeOff className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-slate-400 hover:text-rose-600"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-6 py-12 text-center text-slate-500"
                                            >
                                                No menu items found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Basic Pagination Header Stub */}
                        <div className="mt-4 flex items-center justify-between px-2">
                            <span className="text-sm text-slate-500">
                                Showing page {paginatedMenus.current_page} of{' '}
                                {paginatedMenus.last_page}
                            </span>
                            <div className="flex gap-1">
                                {paginatedMenus.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        preserveState
                                        className={`rounded-md px-3 py-1 text-sm transition-colors ${link.active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'} ${!link.url && 'pointer-events-none opacity-50'}`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

MenusIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Menu Management',
            href: props.currentTeam ? menus.index(props.currentTeam.slug) : '#',
        },
    ],
});
