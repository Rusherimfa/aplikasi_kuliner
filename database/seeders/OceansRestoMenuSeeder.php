<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;

class OceansRestoMenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $menus = [
            [
                'team_id' => 1,
                'name' => 'Kepiting Saus Padang',
                'description' => 'Kepiting bakau segar dengan saus Padang autentik khas Ocean Signature. Perpaduan pedas, manis, dan gurih yang sempurna.',
                'category' => 'Signature Seafood',
                'price' => 250000,
                'image_path' => 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2574&auto=format&fit=crop',
                'is_available' => true,
                'is_best_seller' => true,
            ],
            [
                'team_id' => 1,
                'name' => 'Ikan Kerapu Bakar Parape',
                'description' => 'Ikan kerapu segar dibakar dengan bumbu Parape khas Makassar yang kaya rasa bawang merah dan asam jawa.',
                'category' => 'Grilled Fish',
                'price' => 185000,
                'image_path' => 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd679?q=80&w=2574&auto=format&fit=crop',
                'is_available' => true,
                'is_best_seller' => true,
            ],
            [
                'team_id' => 1,
                'name' => 'Kepiting Karamel',
                'description' => 'Sensasi rasa unik kepiting dengan balutan saus karamel gurih yang meresap hingga ke dalam daging.',
                'category' => 'Signature Seafood',
                'price' => 260000,
                'image_path' => 'https://images.unsplash.com/photo-1553659971-f01207815844?q=80&w=2574&auto=format&fit=crop',
                'is_available' => true,
                'is_best_seller' => true,
            ],
            [
                'team_id' => 1,
                'name' => 'Kaylan 2 Rasa',
                'description' => 'Sayur Kaylan yang diolah dengan dua teknik berbeda: renyah digoreng dan segar ditumis bawang putih.',
                'category' => 'Vegetables',
                'price' => 45000,
                'image_path' => 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2600&auto=format&fit=crop',
                'is_available' => true,
                'is_best_seller' => true,
            ],
            [
                'team_id' => 1,
                'name' => 'Sotong Goreng Tepung',
                'description' => 'Cumi-cumi segar pilihan digoreng dengan tepung bumbu rahasia yang renyah dan gurih.',
                'category' => 'Seafood',
                'price' => 75000,
                'image_path' => 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=2574&auto=format&fit=crop',
                'is_available' => true,
                'is_best_seller' => false,
            ],
            [
                'team_id' => 1,
                'name' => 'Udang Bakar Madu',
                'description' => 'Udang pancet besar dibakar dengan olesan madu murni dan rempah pilihan.',
                'category' => 'Seafood',
                'price' => 120000,
                'image_path' => 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2574&auto=format&fit=crop',
                'is_available' => true,
                'is_best_seller' => false,
            ],
            [
                'team_id' => 1,
                'name' => 'Lobster Thermidor',
                'description' => 'Lobster mutiara utuh dengan saus krim keju, jamur, dan sentuhan cognac yang mewah.',
                'category' => 'Signature Seafood',
                'price' => 850000,
                'image_path' => 'https://images.unsplash.com/photo-1553659971-f01207815844?q=80&w=2574&auto=format&fit=crop',
                'is_available' => true,
                'is_best_seller' => true,
            ],
            [
                'team_id' => 1,
                'name' => 'Truffle Scallop Carpaccio',
                'description' => 'Irisan tipis scallop Hokkaido segar dengan minyak truffle putih dan serpihan garam laut.',
                'category' => 'Appetizer',
                'price' => 175000,
                'image_path' => 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2600&auto=format&fit=crop',
                'is_available' => true,
                'is_best_seller' => false,
            ],
            [
                'team_id' => 1,
                'name' => 'Ocean Blue Mojito',
                'description' => 'Minuman segar dengan perpaduan sirup curacao, jeruk nipis, mint, dan soda kristal.',
                'category' => 'Artisan Beverage',
                'price' => 55000,
                'image_path' => 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=2574&auto=format&fit=crop',
                'is_available' => true,
                'is_best_seller' => true,
            ],
            [
                'team_id' => 1,
                'name' => 'Golden Lava Chocolate',
                'description' => 'Cokelat Belgia leleh dengan taburan emas 24k (edible) dan gelato vanila premium.',
                'category' => 'Dessert',
                'price' => 95000,
                'image_path' => 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=2574&auto=format&fit=crop',
                'is_available' => true,
                'is_best_seller' => true,
            ],
            [
                'team_id' => 1,
                'name' => 'Kerapu Tim Nyonya',
                'description' => 'Ikan kerapu segar di-tim dengan bumbu Nyonya yang asam pedas dan segar aromatik.',
                'category' => 'Signature Fish',
                'price' => 195000,
                'image_path' => 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd679?q=80&w=2574&auto=format&fit=crop',
                'is_available' => true,
                'is_best_seller' => false,
            ],
        ];

        foreach ($menus as $menu) {
            Menu::updateOrCreate(
                ['name' => $menu['name'], 'team_id' => $menu['team_id']],
                $menu
            );
        }
    }
}
