import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Flame, Leaf, Wheat, Info, ShoppingBag, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from '@/hooks/use-translations';
import { usePage } from '@inertiajs/react';

interface DishDetailModalProps {
    dish: any;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (dish: any) => void;
}

export default function DishDetailModal({ dish, isOpen, onClose, onAddToCart }: DishDetailModalProps) {
    const { __ } = useTranslations();
    const { locale } = usePage().props as any;

    if (!dish) return null;

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString(locale === 'id' ? 'id-ID' : 'en-US', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).replace('IDR', 'Rp');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-[#0A0A0B] border-white/10 rounded-[2.5rem] shadow-3xl ring-1 ring-white/5">
                <div className="flex flex-col md:flex-row h-full">
                    {/* Media Side */}
                    <div className="relative w-full md:w-[45%] aspect-square md:aspect-auto bg-slate-900 group">
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            <UtensilsCrossed size={120} strokeWidth={0.5} className="text-white" />
                        </div>
                        
                        {/* Tags over image */}
                        <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                            {dish.is_best_seller && (
                                <Badge className="bg-sky-500 text-black border-none px-4 py-2 font-black text-[10px] uppercase tracking-widest shadow-2xl">
                                    <Flame size={12} className="mr-2" /> Signature
                                </Badge>
                            )}
                            <Badge className="bg-white/10 backdrop-blur-md text-white border-white/10 px-4 py-2 font-black text-[10px] uppercase tracking-widest">
                                {dish.category}
                            </Badge>
                        </div>

                        {/* Visual Ornament */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </div>

                    {/* Content Side */}
                    <div className="flex-1 p-10 flex flex-col justify-between">
                        <div className="space-y-8">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <h2 className="font-['Playfair_Display',serif] text-4xl font-black text-white tracking-tight leading-none">
                                        {dish.name}
                                    </h2>
                                    <p className="text-2xl font-black text-sky-500 italic">
                                        {formatCurrency(Number(dish.price))}
                                    </p>
                                </div>
                            </div>

                            <p className="text-white/40 leading-relaxed font-medium text-lg">
                                {dish.description || __('A symphony of flavors crafted with high dedication by our chefs to provide a culinary experience like never before.')}
                            </p>

                            {/* Infographic Stats */}
                            <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/5">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{__('Preparation Time')}</p>
                                    <p className="text-white font-bold tracking-tight uppercase">15 - 20 {__('Minutes')}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{__('Complexity Level')}</p>
                                    <p className="text-white font-bold tracking-tight uppercase">{__('Masterpiece')}</p>
                                </div>
                            </div>

                            {/* Dietary Info */}
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2 text-white/40">
                                    <Leaf size={16} className="text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Vegan Friendly</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/40">
                                    <Wheat size={16} className="text-sky-300" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Non-Gluten</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex gap-4">
                            <Button 
                                onClick={() => {
                                    onAddToCart(dish);
                                    onClose();
                                }}
                                className="flex-1 h-16 rounded-2xl bg-sky-500 text-black font-black uppercase tracking-[0.2em] text-xs transition-all hover:bg-white hover:scale-[1.02] active:scale-95 shadow-2xl shadow-sky-500/20"
                            >
                                <ShoppingBag size={18} className="mr-3" />
                                Add to Experience
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

