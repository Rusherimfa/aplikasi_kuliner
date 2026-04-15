import { Head, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, Search, ShoppingBag, Flame, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import AIChatbot from '@/components/app/ai-chatbot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';
import { dashboard } from '@/routes';

// Layout Shared Components
import Footer from '../welcome/sections/footer';
import Navbar from '../welcome/sections/navbar';

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
    const dashboardUrl = currentTeam ? dashboard(currentTeam.slug).url : '/';
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { addItem, setCartOpen, cartCount } = useCart();

    const [activeCategory, setActiveCategory] = useState(
        filters.category || 'Semua',
    );
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const rawCategories = Array.from(new Set(menus.map((item) => item.category)));
    const categories = ['Semua', ...rawCategories];

    const filteredMenus = menus.filter((item) => {
        const matchesCategory =
            activeCategory === 'Semua' || item.category === activeCategory;
        const matchesSearch = item.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="relative min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0B] font-['Inter',sans-serif] text-foreground transition-colors duration-500 overflow-hidden">
            <Head title="Katalog Menu — Seleksi Gastronomi Premium" />
            
            {/* Premium Decorative Ambient */}
            <div className="pointer-events-none absolute top-[-10%] right-[-10%] h-[800px] w-[800px] rounded-full bg-amber-500/5 blur-[140px]" />
            <div className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-amber-600/5 blur-[120px]" />

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
                            className="inline-flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-2 text-[10px] font-black tracking-[0.3em] text-amber-600 dark:text-amber-500 uppercase glow-amber"
                        >
                            Exquisite Menu
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-['Playfair_Display',serif] text-5xl font-black text-slate-900 dark:text-white md:text-7xl tracking-tighter"
                        >
                            Seleksi <span className="italic font-serif opacity-40">Gastronomi</span>
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
                                className="h-14 rounded-3xl border-none bg-slate-50 dark:bg-white/5 pl-14 text-base font-medium placeholder:text-slate-400 focus:ring-amber-500/30 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <Button
                                onClick={() => setCartOpen(true)}
                                className="h-14 rounded-[1.25rem] bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest px-8 shadow-xl transition-all hover:scale-105 active:scale-95 relative"
                            >
                                <ShoppingBag size={18} className="mr-3" />
                                Cart
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-[11px] font-black text-black border-2 border-white dark:border-[#0A0A0B] shadow-lg animate-in zoom-in">
                                        {cartCount}
                                    </span>
                                )}
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
                                className={`whitespace-nowrap rounded-2xl px-8 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 ${
                                    activeCategory === category
                                        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                                        : 'bg-white dark:bg-white/5 border border-border dark:border-white/5 text-slate-500 dark:text-neutral-500 hover:border-amber-500/30'
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
                                className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4"
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
                                        <div className="glass-card flex h-full flex-col overflow-hidden rounded-[2.5rem] bg-white dark:bg-white/[0.02] border-border dark:border-white/5 transition-all duration-700 hover:-translate-y-3 hover:border-amber-500/30 hover:shadow-amber-500/10 active:scale-[0.98]">
                                            {/* Media Area */}
                                            <div className="relative aspect-square overflow-hidden m-3 rounded-[1.75rem] bg-slate-50 dark:bg-white/5">
                                                <div className="absolute inset-0 flex items-center justify-center opacity-40 transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-6">
                                                    <UtensilsCrossed size={64} strokeWidth={1} />
                                                </div>
                                                
                                                {/* Labels */}
                                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                    {item.is_best_seller && (
                                                        <div className="flex items-center gap-2 rounded-xl bg-amber-500 px-3 py-1.5 text-[10px] font-black text-black uppercase tracking-widest shadow-xl">
                                                            <Flame size={12} />
                                                            Popular
                                                        </div>
                                                    )}
                                                    <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 text-[10px] font-black text-white/60 uppercase tracking-widest">
                                                        {item.category}
                                                    </div>
                                                </div>

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex flex-1 flex-col p-8 pt-4">
                                                <div className="mb-4 flex flex-col items-start gap-1">
                                                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                                                        {item.name}
                                                    </h3>
                                                    <span className="text-base font-black text-amber-500">
                                                        Rp {Number(item.price).toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                                <p className="mb-10 line-clamp-2 flex-1 text-sm font-medium leading-relaxed text-slate-500 dark:text-neutral-400">
                                                    {item.description || 'Simfoni rasa yang diciptakan untuk memanjakan lidah Anda.'}
                                                </p>

                                                <Button
                                                    onClick={() => addItem({ id: item.id, name: item.name, price: item.price })}
                                                    className="w-full h-12 rounded-2xl bg-slate-900 dark:bg-white/5 border border-transparent dark:border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white dark:text-white/60 transition-all hover:bg-amber-500 hover:text-black dark:hover:bg-amber-500 dark:hover:text-black group active:scale-95"
                                                >
                                                    Add to Order
                                                </Button>
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
                                    className="h-14 rounded-2xl px-10 bg-amber-500 text-black font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-amber-500/10"
                                >
                                    <ArrowLeft size={16} className="mr-3" />
                                    Reset Filters
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <Footer />
            <AIChatbot />
        </div>
    );
}
