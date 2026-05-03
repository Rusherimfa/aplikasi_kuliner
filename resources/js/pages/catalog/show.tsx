import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, 
    ShoppingBag, 
    Flame, 
    Clock, 
    Users, 
    Utensils, 
    ChevronRight,
    Star,
    Share2,
    Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/use-translations';
import { useState } from 'react';
import { dashboard } from '@/routes';
import Navbar from '../welcome/sections/navbar';
import Footer from '../welcome/sections/footer';
import GuestSupportChat from '@/components/app/guest-support-chat';
import AIChatbot from '@/components/app/ai-chatbot';
import HomeLiveChat from '@/components/app/home-live-chat';
import { cn } from '@/lib/utils';
import { usePage } from '@inertiajs/react';

interface MenuShowProps {
    menu: any;
    relatedMenus: any[];
}

export default function Show({ menu, relatedMenus }: MenuShowProps) {
    const { auth } = usePage().props as any;
    const { __ } = useTranslations();
    const { addItem, setCartOpen } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dashboardUrl = dashboard().url;

    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(menu.price);

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-slate-900 dark:text-white selection:bg-primary/20">
            <Head title={`${menu.name} - Ocean's Resto`} />
            
            <Navbar 
                auth={auth}
                dashboardUrl={dashboardUrl}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
            />

            <main className="pt-24 pb-20">
                <div className="container mx-auto px-4">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-8">
                        <Link href="/" className="hover:text-primary transition-colors">{__('Home')}</Link>
                        <ChevronRight size={10} />
                        <Link href="/catalog" className="hover:text-primary transition-colors">{__('Menu')}</Link>
                        <ChevronRight size={10} />
                        <span className="text-slate-600 dark:text-slate-300">{menu.name}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                        {/* Left: Image Gallery (Cinematic) */}
                        <div className="lg:col-span-7">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-white dark:bg-neutral-900 shadow-2xl border border-black/5 dark:border-white/5"
                            >
                                {menu.image_path ? (
                                    <img 
                                        src={menu.image_path.startsWith('http') ? menu.image_path : `/storage/${menu.image_path}`} 
                                        alt={menu.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-white/5">
                                        <Utensils size={80} className="text-slate-200" />
                                    </div>
                                )}

                                {/* Floating Badges */}
                                <div className="absolute top-8 left-8 flex flex-col gap-3">
                                    {menu.is_best_seller && (
                                        <div className="flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest shadow-xl">
                                            <Flame size={12} />
                                            {__('BEST SELLER')}
                                        </div>
                                    )}
                                    <div className="rounded-full bg-black/40 backdrop-blur-md px-4 py-2 text-[10px] font-black text-white/90 border border-white/10 uppercase tracking-widest">
                                        {menu.category}
                                    </div>
                                </div>

                                {/* Floating Actions */}
                                <div className="absolute bottom-8 right-8 flex gap-3">
                                    <button className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                                        <Heart size={20} />
                                    </button>
                                    <button className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right: Info Section */}
                        <div className="lg:col-span-5 flex flex-col">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">
                                    {menu.category}
                                </span>
                                <h1 className="font-serif text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-[1.1] mb-6">
                                    {menu.name}
                                </h1>
                                
                                <div className="flex items-center gap-6 mb-8 text-slate-400 text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <div className="flex text-amber-400">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} />)}
                                        </div>
                                        <span className="text-slate-900 dark:text-white font-bold">4.8</span>
                                        <span>(124 {__('reviews')})</span>
                                    </div>
                                </div>

                                <div className="text-4xl font-serif font-black text-sky-500 italic mb-10">
                                    {formattedPrice}
                                </div>

                                <div className="space-y-8 mb-12">
                                    <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                        {menu.description || __('A culinary masterpiece crafted with precision and passion, using only the finest seasonal ingredients to create an unforgettable dining experience.')}
                                    </p>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                                <Clock size={20} className="text-primary" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{__('Preparation')}</div>
                                                <div className="text-sm font-bold text-slate-900 dark:text-white">15-20 Min</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                                <Users size={20} className="text-primary" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{__('Serves')}</div>
                                                <div className="text-sm font-bold text-slate-900 dark:text-white">1-2 People</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-4">
                                    <Button 
                                        size="lg"
                                        onClick={() => {
                                            addItem(menu);
                                            setCartOpen(true);
                                            toast.success(`${menu.name} ${__('added to cart')}`);
                                        }}
                                        className="h-16 rounded-2xl bg-[#0f172a] dark:bg-primary hover:bg-[#1e293b] text-white text-lg font-black uppercase tracking-[0.2em] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4"
                                    >
                                        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                                            <ShoppingBag size={20} />
                                        </div>
                                        {__('ADD TO ORDER')}
                                    </Button>

                                    <Link href="/catalog" className="w-full">
                                        <Button 
                                            variant="outline"
                                            className="w-full h-14 rounded-2xl border-slate-200 dark:border-white/10 text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5"
                                        >
                                            <ArrowLeft size={16} className="mr-3" />
                                            {__('Back to Menu')}
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedMenus.length > 0 && (
                        <div className="mt-32">
                            <div className="flex items-center justify-between mb-12">
                                <h2 className="font-serif text-4xl font-bold">{__('Similar Delicacies')}</h2>
                                <Link href="/catalog" className="text-xs font-black uppercase tracking-widest text-primary hover:underline">
                                    {__('View All')}
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {relatedMenus.map((item, idx) => (
                                    <motion.div 
                                        key={item.id}
                                        whileHover={{ y: -10 }}
                                        className="group"
                                    >
                                        <Link href={`/catalog/${item.id}`}>
                                            <div className="aspect-square rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/5 mb-4 relative shadow-lg">
                                                {item.image_path ? (
                                                    <img 
                                                        src={item.image_path.startsWith('http') ? item.image_path : `/storage/${item.image_path}`} 
                                                        alt={item.name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-white/5">
                                                        <Utensils size={32} className="text-slate-200" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                                            </div>
                                            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                                            <div className="text-sky-500 font-bold italic">
                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.price)}
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />

            {auth.user ? (
                <HomeLiveChat currentUser={auth.user} />
            ) : (
                <GuestSupportChat />
            )}
            <AIChatbot />
        </div>
    );
}
