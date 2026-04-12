import { Head, Link, usePage } from '@inertiajs/react';
import { UtensilsCrossed, Search, ShoppingBag, Flame } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes';
import { useCart } from '@/hooks/use-cart';

// Layout Shared Components
import Navbar from '../welcome/sections/navbar';
import Footer from '../welcome/sections/footer';
import AIChatbot from '@/components/app/ai-chatbot';

interface Menu {
    id: number;
    name: string;
    description: string | null;
    category: string;
    price: string;
    is_best_seller: boolean;
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
    const { addItem, setCartOpen, cartCount } = useCart();

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

            <div className="min-h-screen bg-background font-['Inter',sans-serif] text-foreground selection:bg-amber-100 selection:text-amber-900 transition-colors duration-500">
                
                <Navbar
                    auth={auth}
                    dashboardUrl={dashboardUrl}
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                />

                <main className="mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mx-auto mb-16 flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
                        <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
                            <h1 className="mb-4 font-['Playfair_Display',serif] text-4xl font-bold text-foreground sm:text-5xl">
                                Seleksi Gastronomi
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Jelajahi penawaran lengkap kami. Dari hidangan pembuka yang ringan hingga hidangan utama khas kami, semuanya disiapkan dengan sempurna.
                            </p>
                        </div>
                        
                        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center animate-in fade-in slide-in-from-right-8 duration-1000 delay-300 fill-mode-both">
                            <div className="relative w-full sm:w-64 z-30">
                                <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari hidangan istimewa..."
                                    className="h-10 rounded-full border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:ring-amber-500/20 shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="z-30 h-10 w-full sm:w-auto">
                                <Button
                                    onClick={() => setCartOpen(true)}
                                    variant="outline"
                                    className="h-10 w-full rounded-full border-border bg-card text-foreground hover:bg-muted hover:border-border shadow-sm relative"
                                >
                                    <ShoppingBag size={16} className="mr-2" />
                                    Keranjang
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white shadow-sm">
                                            {cartCount}
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="mb-12 flex flex-wrap items-center justify-center gap-3 md:justify-start relative z-30 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                                    activeCategory === category
                                        ? 'bg-amber-600 text-white shadow-md shadow-amber-900/20'
                                        : 'border border-border bg-card text-muted-foreground hover:border-amber-500/50 hover:bg-muted'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Catalog Grid */}
                    {filteredMenus.length > 0 ? (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 relative z-30">
                            {filteredMenus.map((item, index) => (
                                <div
                                    key={item.id}
                                    style={{ animationFillMode: 'both', animationDelay: `${index * 100}ms` }}
                                    className="animate-in fade-in slide-in-from-bottom-8 duration-700 group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/10"
                                >
                                    <div className="relative aspect-square overflow-hidden bg-muted">
                                        {/* Image placeholder */}
                                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 transition-transform duration-700 group-hover:scale-110">
                                            <UtensilsCrossed size={48} className="opacity-70" />
                                        </div>
                                        
                                        {/* Best Seller Badge */}
                                        {item.is_best_seller && (
                                            <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white shadow-lg z-10">
                                                <Flame size={11} />
                                                Sangat Laris
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="mb-2 flex items-start justify-between gap-3">
                                            <h3 className="text-lg leading-tight font-semibold text-foreground">
                                                {item.name}
                                            </h3>
                                            <span className="font-bold whitespace-nowrap text-amber-500">
                                                Rp {Number(item.price).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <p className="mb-6 line-clamp-3 flex-1 text-sm text-muted-foreground leading-relaxed">
                                            {item.description ||
                                                'Tambahan luar biasa untuk melengkapi pengalaman bersantap Anda, disusun oleh koki terbaik kami.'}
                                        </p>

                                        <div className="mt-auto">
                                            <Button
                                                onClick={() => addItem({ id: item.id, name: item.name, price: item.price })}
                                                variant="outline"
                                                className="w-full rounded-2xl border-border bg-card text-foreground transition-all duration-300 hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-500 shadow-sm"
                                            >
                                                + Tambah
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed border-border bg-card py-24 text-center shadow-sm relative z-30">
                            <UtensilsCrossed size={48} className="mx-auto mb-6 text-muted-foreground/30" />
                            <h3 className="mb-3 font-['Playfair_Display',serif] text-2xl font-medium text-foreground">
                                Menu tidak ditemukan
                            </h3>
                            <p className="mx-auto mb-8 max-w-md text-muted-foreground">
                                Kami tidak dapat menemukan hidangan yang sesuai dengan pencarian atau kategori yang Anda pilih.
                            </p>
                            <Button
                                variant="outline"
                                className="rounded-full border-border bg-card text-foreground hover:bg-muted hover:border-border shadow-sm"
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
                
                <AIChatbot />
            </div>
        </>
    );
}
