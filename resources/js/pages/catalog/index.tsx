import { Head, Link, usePage } from '@inertiajs/react';
import { UtensilsCrossed, Search, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { login, dashboard } from '@/routes';

// Layout Shared Components
import Navbar from '../welcome/sections/navbar';
import Footer from '../welcome/sections/footer';

interface Menu {
    id: number;
    name: string;
    description: string | null;
    category: string;
    price: string;
}

interface PageProps {
    menus: Menu[];
    filters: {
        category?: string;
        search?: string;
    };
}

export default function CatalogIndex({ menus, filters }: PageProps) {
    const { auth, currentTeam } = usePage().props as any;
    const dashboardUrl = dashboard().url;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [activeCategory, setActiveCategory] = useState(
        filters.category || 'Semua',
    );
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    // Extract unique categories from menus for the filter tabs
    const rawCategories = Array.from(new Set(menus.map((item) => item.category)));
    const categories = ['Semua', ...rawCategories];

    // Client-side filtering for immediate snappy response
    const filteredMenus = menus.filter((item) => {
        const matchesCategory =
            activeCategory === 'Semua' || item.category === activeCategory;
        const matchesSearch = item.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <>
            <Head title="Katalog Menu - RestoWeb" />

            <div className="min-h-screen bg-[#0A0A0B] font-['Inter',sans-serif] text-slate-300 selection:bg-amber-500/30 selection:text-amber-200">
                
                <Navbar
                    auth={auth}
                    dashboardUrl={dashboardUrl}
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                />

                <main className="mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mx-auto mb-16 flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
                        <div className="max-w-2xl">
                            <h1 className="mb-4 font-['Playfair_Display',serif] text-4xl font-bold text-white sm:text-5xl">
                                Seleksi Gastronomi
                            </h1>
                            <p className="text-lg text-white/50">
                                Jelajahi penawaran lengkap kami. Dari hidangan pembuka yang ringan hingga hidangan utama khas kami, semuanya disiapkan dengan sempurna.
                            </p>
                        </div>
                        
                        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
                            <div className="relative w-full sm:w-64 z-30">
                                <Search className="absolute top-3 left-3 h-4 w-4 text-white/40" />
                                <Input
                                    type="search"
                                    placeholder="Cari hidangan istimewa..."
                                    className="h-10 rounded-full border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/40 focus:border-amber-500/50 focus:ring-amber-500/50"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Link href={auth.user ? dashboardUrl : login().url} className="z-30">
                                <Button
                                    variant="outline"
                                    className="h-10 w-full rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 sm:w-auto"
                                >
                                    <ShoppingBag size={16} className="mr-2" />
                                    Keranjang
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="mb-12 flex flex-wrap items-center justify-center gap-3 md:justify-start relative z-30">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                                    activeCategory === category
                                        ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40'
                                        : 'border border-white/10 bg-white/[0.03] text-white/60 hover:border-white/30 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Catalog Grid */}
                    {filteredMenus.length > 0 ? (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 relative z-30">
                            {filteredMenus.map((item) => (
                                <div
                                    key={item.id}
                                    className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-amber-900/20"
                                >
                                    <div className="relative aspect-square overflow-hidden bg-white/5">
                                        {/* Image placeholder */}
                                        <div className="absolute inset-0 flex items-center justify-center text-white/10 transition-transform duration-700 group-hover:scale-110">
                                            <UtensilsCrossed size={48} className="opacity-50" />
                                        </div>
                                    </div>

                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="mb-2 flex items-start justify-between gap-3">
                                            <h3 className="text-lg leading-tight font-semibold text-white">
                                                {item.name}
                                            </h3>
                                            <span className="font-bold whitespace-nowrap text-amber-500">
                                                Rp {Number(item.price).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <p className="mb-6 line-clamp-3 flex-1 text-sm text-white/50 leading-relaxed">
                                            {item.description ||
                                                'Tambahan luar biasa untuk melengkapi pengalaman bersantap Anda, disusun oleh koki terbaik kami.'}
                                        </p>

                                        <Link
                                            href={auth.user ? '#' : login().url}
                                            className="mt-auto"
                                        >
                                            <Button
                                                variant="outline"
                                                className="w-full rounded-2xl border-white/10 bg-white/5 text-white/80 transition-all duration-300 hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-400"
                                            >
                                                + Tambah
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 py-24 text-center backdrop-blur-sm relative z-30">
                            <UtensilsCrossed size={48} className="mx-auto mb-6 text-white/20" />
                            <h3 className="mb-3 font-['Playfair_Display',serif] text-2xl font-medium text-white">
                                Menu tidak ditemukan
                            </h3>
                            <p className="mx-auto mb-8 max-w-md text-white/50">
                                Kami tidak dapat menemukan hidangan yang sesuai dengan pencarian atau kategori yang Anda pilih.
                            </p>
                            <Button
                                variant="outline"
                                className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:border-white/40"
                                onClick={() => {
                                    setActiveCategory('Semua');
                                    setSearchTerm('');
                                }}
                            >
                                Atur Ulang Filter
                            </Button>
                        </div>
                    )}
                </main>

                <Footer />
            </div>
        </>
    );
}
