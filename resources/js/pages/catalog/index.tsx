import { Head, Link, usePage } from '@inertiajs/react';
import { UtensilsCrossed, Search, ShoppingBag, Flame, SlidersHorizontal, ArrowLeft, Info, Eye } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes';
import { useCart } from '@/hooks/use-cart';
import { motion, AnimatePresence } from 'framer-motion';

// Layout Shared Components
import Navbar from '../welcome/sections/navbar';
import Footer from '../welcome/sections/footer';
import AIChatbot from '@/components/app/ai-chatbot';
import DishDetailModal from '@/components/app/dish-detail-modal';

interface Menu {
    id: number;
    name: string;
    description: string | null;
    category: string;
    price: string;
    is_best_seller: boolean;
    is_available: boolean;
    image_path: string | null;
}

interface PageProps {
    menus: Menu[];
    filters: {
        category?: string;
        search?: string;
    };
}

export default function CatalogIndex({ menus, filters }: PageProps) {
    const { auth } = usePage().props as any;
    const dashboardUrl = dashboard().url;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { addItem, setCartOpen, cartCount } = useCart();

    const [activeCategory, setActiveCategory] = useState(
        filters.category || 'Semua',
    );
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedDish, setSelectedDish] = useState<any>(null);

    const rawCategories = Array.from(new Set(menus.map((item) => item.category)));
    const categories = ['Semua', 'Best Seller', ...rawCategories];

    const filteredMenus = menus.filter((item) => {
        let matchesCategory = false;
        if (activeCategory === 'Semua') {
            matchesCategory = true;
        } else if (activeCategory === 'Best Seller') {
            matchesCategory = !!item.is_best_seller;
        } else {
            matchesCategory = item.category === activeCategory;
        }

        const matchesSearch = item.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    const formatRupiah = (amount: number | string) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(amount));
    };

    return (
        <div className="relative min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0B] font-['Inter',sans-serif] text-foreground transition-colors duration-500 overflow-hidden">
            <Head title="Katalog Menu â€” Seleksi Gastronomi Premium" />
            
            {/* Premium Decorative Ambient */}
            <div className="pointer-events-none absolute top-[-10%] right-[-10%] h-[800px] w-[800px] rounded-full bg-sky-500/5 blur-[140px]" />
            <div className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-sky-600/5 blur-[120px]" />

            <Navbar
                auth={auth}
                dashboardUrl={dashboardUrl}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
            />

            <main className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-32 sm:px-8 lg:px-10">
                {/* Hero Header */}
                <div className="mb-20 space-y-12">
                    <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 rounded-2xl border border-sky-500/20 bg-sky-500/5 px-5 py-2 text-[10px] font-black tracking-[0.3em] text-sky-600 dark:text-sky-500 uppercase glow-primary"
                        >
                            Exquisite Menu
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-['Playfair_Display',serif] text-4xl font-black text-slate-900 dark:text-white md:text-7xl tracking-tighter"
                        >
                            Seleksi <span className="italic font-serif opacity-40 text-sky-500">Gastronomi</span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg font-medium text-slate-500 dark:text-neutral-400"
                        >
                            Jelajahi petualangan rasa kami yang dikurasi dengan presisi. Dari kreasi klasik hingga inovasi kontemporer.
                        </motion.p>
                    </div>

                    {/* Integrated Controls Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card flex flex-col md:flex-row items-center gap-6 p-4 rounded-[2.5rem] bg-white/70 dark:bg-white/[0.02] border-border dark:border-white/5"
                    >
                        <div className="relative flex-1 w-full">
                            <Search className="absolute top-4 left-5 h-5 w-5 text-slate-400" />
                            <Input
                                type="search"
                                placeholder="Cari hidangan istimewa..."
                                className="h-14 rounded-3xl border-none bg-slate-50 dark:bg-white/5 pl-14 text-base font-medium placeholder:text-slate-400 focus:ring-sky-500/30 transition-all font-sans"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <Button
                                onClick={() => setCartOpen(true)}
                                className="h-14 rounded-[1.25rem] bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] text-[10px] px-8 shadow-2xl transition-all hover:scale-105 active:scale-95 relative"
                            >
                                <ShoppingBag size={18} className="mr-3" />
                                Cart
                                <AnimatePresence>
                                    {cartCount > 0 && (
                                        <motion.span 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-[11px] font-black text-black border-2 border-white dark:border-[#0A0A0B] shadow-lg"
                                        >
                                            {cartCount}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Button>
                        </div>
                    </motion.div>

                    {/* Category Filter Horizontal Scroll */}
                    <div className="scrollbar-hide flex items-center gap-3 overflow-x-auto pb-4">
                        {categories.map((category, idx) => (
                            <motion.button
                                key={category}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + (idx * 0.05) }}
                                onClick={() => setActiveCategory(category)}
                                className={`whitespace-nowrap rounded-2xl px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 active:scale-95 ${
                                    activeCategory === category
                                        ? 'bg-sky-500 text-black shadow-xl shadow-sky-500/20'
                                        : 'bg-white dark:bg-white/5 border border-border dark:border-white/5 text-slate-500 dark:text-neutral-500 hover:border-sky-500/30'
                                }`}
                            >
                                {category}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Catalog Grid */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode="popLayout">
                        {filteredMenus.length > 0 ? (
                            <motion.div 
                                layout
                                className="grid grid-cols-1 gap-6 md:gap-10 sm:grid-cols-2 lg:grid-cols-4"
                            >
                                {filteredMenus.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                        transition={{ duration: 0.5, delay: index * 0.05 }}
                                        className="group h-full"
                                    >
                                        <div className="glass-card relative flex h-full flex-col overflow-hidden rounded-[2.5rem] bg-white dark:bg-white/5 border-border dark:border-white/10 transition-all duration-700 md:hover:-translate-y-3 hover:border-sky-500/30 hover:shadow-2xl shadow-sky-500/5 active:scale-[0.98]">
                                            {/* Media Area */}
                                            <div className="relative aspect-[4/3] md:aspect-square overflow-hidden m-2 md:m-3 rounded-[1.5rem] md:rounded-[1.75rem] bg-slate-50 dark:bg-white/5">
                                                {item.image_path ? (
                                                    <img 
                                                        src={`/storage/${item.image_path}`} 
                                                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                                        alt={item.name} 
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-40 transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-12">
                                                        <UtensilsCrossed className="w-12 h-12 md:w-16 md:h-16" strokeWidth={1} />
                                                    </div>
                                                )}
                                                
                                                {/* Labels */}
                                                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                                    {!!item.is_best_seller && (
                                                        <div className="flex items-center gap-2 rounded-xl bg-sky-500 px-3 py-1.5 text-[10px] font-black text-black uppercase tracking-widest shadow-xl">
                                                            <Flame size={12} />
                                                            Best Seller
                                                        </div>
                                                    )}
                                                    <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 text-[10px] font-black text-white/60 uppercase tracking-widest">
                                                        {item.category}
                                                    </div>
                                                </div>

                                                {/* Hover Overlay for Detail */}
                                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-6">
                                                    <Button 
                                                        onClick={() => setSelectedDish(item)}
                                                        className="bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl h-12 px-6 shadow-2xl transition-all hover:scale-110"
                                                    >
                                                        <Eye size={14} className="mr-2" /> Detail Rasa
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex flex-1 flex-col p-5 md:p-8 pt-2 md:pt-4">
                                                <div className="mb-3 md:mb-4 flex flex-col items-start gap-0.5 md:gap-1">
                                                    <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-sky-500 transition-colors">
                                                        {item.name}
                                                    </h3>
                                                    <span className="text-base md:text-lg font-black text-sky-500 italic">
                                                        {formatRupiah(item.price)}
                                                    </span>
                                                </div>
                                                <p className="mb-6 md:mb-8 line-clamp-2 flex-1 text-xs md:text-sm font-medium leading-relaxed text-slate-500 dark:text-neutral-500">
                                                    {item.description || 'Simfoni rasa yang dirancang oleh chef untuk memanjakan indera Anda.'}
                                                </p>

                                                {item.is_available ? (
                                                    <Button
                                                        onClick={() => addItem({ id: item.id, name: item.name, price: item.price })}
                                                        className="w-full h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-sky-500 hover:text-black dark:hover:bg-sky-500 dark:hover:text-black group active:scale-95 shadow-xl border border-transparent"
                                                    >
                                                        <ShoppingBag size={14} className="mr-3" />
                                                        Add to Order
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        disabled
                                                        className="w-full h-14 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/30 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-200 dark:border-white/10 opacity-80 cursor-not-allowed"
                                                    >
                                                        Tidak Tersedia
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-32 glass-card rounded-[3rem] border-dashed border-2"
                            >
                                <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-8">
                                    <SlidersHorizontal size={32} className="text-slate-300 dark:text-neutral-700" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
                                    No Delicacies Found
                                </h3>
                                <p className="text-slate-500 dark:text-neutral-500 font-medium mb-10 max-w-sm text-center">
                                    Tidak dapat menemukan hidangan yang sesuai. Coba ubah pencarian atau filter Anda.
                                </p>
                                <Button
                                    onClick={() => {
                                        setActiveCategory('Semua');
                                        setSearchTerm('');
                                    }}
                                    className="h-14 rounded-2xl px-10 bg-sky-500 text-black font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-sky-500/10"
                                >
                                    <ArrowLeft size={16} className="mr-3" />
                                    Reset Filters
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Dish Detail Modal */}
            <DishDetailModal 
                dish={selectedDish}
                isOpen={!!selectedDish}
                onClose={() => setSelectedDish(null)}
                onAddToCart={addItem}
            />

            <Footer />
            <AIChatbot />
        </div>
    );
}


