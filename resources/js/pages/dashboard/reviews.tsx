import { Head, useForm, usePage, router } from '@inertiajs/react';
import RestoAdminLayout from '@/layouts/resto-admin-layout';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
    MessageSquare, 
    Star, 
    Search, 
    Eye, 
    EyeOff, 
    Trash2, 
    Quote,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/use-translations';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function AdminReviews({ feedbacks }: { feedbacks: any[] }) {
    const { __ } = useTranslations();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRating, setFilterRating] = useState<number | 'all'>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'visible' | 'hidden'>('all');

    // Dialog States
    const [deleteItem, setDeleteItem] = useState<{id: number, type: string} | null>(null);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const filteredFeedbacks = feedbacks.filter(f => {
        const matchesSearch = 
            (f.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
            (f.message?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        
        const matchesRating = filterRating === 'all' || f.rating === filterRating;
        
        const matchesStatus = 
            filterStatus === 'all' || 
            (filterStatus === 'visible' && f.is_approved) || 
            (filterStatus === 'hidden' && !f.is_approved);

        return matchesSearch && matchesRating && matchesStatus;
    });

    const stats = {
        total: feedbacks.length,
        visible: feedbacks.filter(f => f.is_approved).length,
        hidden: feedbacks.filter(f => !f.is_approved).length,
        lowRating: feedbacks.filter(f => f.rating <= 3).length
    };

    const toggleVisibility = (id: number, type: string, currentStatus: boolean) => {
        router.patch(`/reviews/${id}/toggle`, { type }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(currentStatus ? __('Review disembunyikan.') : __('Review ditampilkan.'));
            }
        });
    };

    const confirmDelete = () => {
        if (!deleteItem) return;
        
        router.delete(`/reviews/${deleteItem.id}`, {
            data: { type: deleteItem.type },
            preserveScroll: true,
            onSuccess: () => {
                setDeleteItem(null);
                setShowSuccessDialog(true);
            }
        });
    };

    return (
        <RestoAdminLayout>
            <Head title="Manajemen Cerita Tamu - Ocean's Resto" />
            
            <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">
                            {__('Manajemen Cerita Tamu')}
                        </h1>
                        <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                            {__('Kontrol dan moderasi ulasan serta pengalaman yang dibagikan pelanggan.')}
                        </p>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="glass-card flex flex-col justify-between rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5">
                        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                            <MessageSquare size={18} />
                            <span className="text-xs font-black uppercase tracking-widest">{__('Total')}</span>
                        </div>
                        <p className="mt-4 text-4xl font-black text-slate-900 dark:text-white">{stats.total}</p>
                    </div>
                    <div className="glass-card flex flex-col justify-between rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5">
                        <div className="flex items-center gap-3 text-emerald-500">
                            <Eye size={18} />
                            <span className="text-xs font-black uppercase tracking-widest">{__('Ditampilkan')}</span>
                        </div>
                        <p className="mt-4 text-4xl font-black text-slate-900 dark:text-white">{stats.visible}</p>
                    </div>
                    <div className="glass-card flex flex-col justify-between rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5">
                        <div className="flex items-center gap-3 text-amber-500">
                            <EyeOff size={18} />
                            <span className="text-xs font-black uppercase tracking-widest">{__('Disembunyikan')}</span>
                        </div>
                        <p className="mt-4 text-4xl font-black text-slate-900 dark:text-white">{stats.hidden}</p>
                    </div>
                    <div className="glass-card flex flex-col justify-between rounded-[2rem] p-6 border border-rose-500/20 bg-rose-50 dark:bg-rose-500/5">
                        <div className="flex items-center gap-3 text-rose-500">
                            <Star size={18} />
                            <span className="text-xs font-black uppercase tracking-widest">{__('Rating Rendah (≤3)')}</span>
                        </div>
                        <p className="mt-4 text-4xl font-black text-rose-600 dark:text-rose-400">{stats.lowRating}</p>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="glass-card flex flex-col gap-4 rounded-[2rem] p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 md:flex-row md:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input 
                            placeholder={__('Cari nama atau isi ulasan...')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '3rem' }}
                            className="h-12 rounded-2xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="h-12 rounded-2xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-4 text-sm font-bold text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            <option value="all">{__('Semua Status')}</option>
                            <option value="visible">{__('Ditampilkan')}</option>
                            <option value="hidden">{__('Disembunyikan')}</option>
                        </select>
                        
                        <select 
                            value={filterRating}
                            onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                            className="h-12 rounded-2xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-4 text-sm font-bold text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            <option value="all">{__('Semua Rating')}</option>
                            <option value="5">5 Bintang</option>
                            <option value="4">4 Bintang</option>
                            <option value="3">3 Bintang</option>
                            <option value="2">2 Bintang</option>
                            <option value="1">1 Bintang</option>
                        </select>
                    </div>
                </div>

                {/* Feedbacks Grid */}
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <AnimatePresence>
                        {filteredFeedbacks.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="col-span-full flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-slate-300 dark:border-white/10 py-20 text-center"
                            >
                                <MessageSquare size={48} className="mb-4 text-slate-300 dark:text-white/20" />
                                <p className="text-lg font-bold text-slate-500 dark:text-slate-400">{__('Tidak ada cerita tamu yang ditemukan.')}</p>
                            </motion.div>
                        ) : (
                            filteredFeedbacks.map((item, index) => (
                                <motion.div
                                    key={`${item.type}-${item.id}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`glass-card relative flex flex-col rounded-[2.5rem] border p-6 transition-all ${
                                        item.is_approved 
                                            ? 'border-slate-200 dark:border-white/5 bg-white dark:bg-white/5' 
                                            : 'border-amber-500/30 bg-amber-50 dark:bg-amber-500/5 opacity-75 grayscale-[0.5]'
                                    }`}
                                >
                                    {/* Type Badge */}
                                    <div className="absolute -top-3 -right-3">
                                        <Badge variant="outline" className={`px-4 py-1 text-[10px] font-black uppercase tracking-widest shadow-xl rounded-full ${
                                            item.type === 'review' ? 'bg-sky-500 text-white border-sky-400' : 'bg-purple-500 text-white border-purple-400'
                                        }`}>
                                            {item.type === 'review' ? 'Review' : 'Testimonial'}
                                        </Badge>
                                    </div>

                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white">{item.name}</h3>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{item.source}</p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-lg">
                                            <Star size={14} className="fill-current" />
                                            <span className="text-xs font-black">{item.rating}.0</span>
                                        </div>
                                    </div>

                                    <div className="flex-1 relative mb-6">
                                        <Quote size={24} className="absolute -top-2 -left-2 text-slate-200 dark:text-white/5" />
                                        <p className="text-sm text-slate-600 dark:text-slate-300 relative z-10 pl-4 italic">
                                            "{item.message}"
                                        </p>
                                    </div>

                                    {item.image_path && (
                                        <div className="mb-6 h-32 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
                                            <img src={`/storage/${item.image_path}`} alt="Review" className="w-full h-full object-cover" />
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-white/5">
                                        <Button 
                                            variant="outline" 
                                            onClick={() => toggleVisibility(item.id, item.type, item.is_approved)}
                                            className={`flex-1 rounded-xl border-slate-200 dark:border-white/10 text-xs font-bold ${
                                                item.is_approved 
                                                    ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10' 
                                                    : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                                            }`}
                                        >
                                            {item.is_approved ? (
                                                <><EyeOff size={14} className="mr-2" /> {__('Sembunyikan')}</>
                                            ) : (
                                                <><Eye size={14} className="mr-2" /> {__('Tampilkan')}</>
                                            )}
                                        </Button>
                                        <Button 
                                            variant="destructive" 
                                            onClick={() => setDeleteItem({ id: item.id, type: item.type })}
                                            className="rounded-xl px-3 bg-rose-100 dark:bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
                <DialogContent className="sm:max-w-md bg-white dark:bg-[#0A0A0B] border-slate-200 dark:border-white/10 rounded-[2rem] p-8">
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="h-16 w-16 bg-rose-100 dark:bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-2">
                            <AlertTriangle size={32} />
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white mb-2">{__('Hapus Cerita Tamu?')}</DialogTitle>
                            <DialogDescription className="text-slate-500 dark:text-slate-400">
                                {__('Tindakan ini tidak dapat dibatalkan. Cerita tamu ini akan dihapus secara permanen dari sistem.')}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="w-full flex sm:justify-center gap-3 mt-6">
                            <Button 
                                variant="outline" 
                                onClick={() => setDeleteItem(null)}
                                className="flex-1 rounded-2xl h-12 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                            >
                                {__('Batal')}
                            </Button>
                            <Button 
                                variant="destructive" 
                                onClick={confirmDelete}
                                className="flex-1 rounded-2xl h-12 bg-rose-500 hover:bg-rose-600 text-white font-bold"
                            >
                                {__('Ya, Hapus')}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Success Dialog */}
            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent className="sm:max-w-md bg-white dark:bg-[#0A0A0B] border-slate-200 dark:border-white/10 rounded-[2rem] p-8">
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-2">
                            <CheckCircle2 size={32} />
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white mb-2">{__('Berhasil Dihapus')}</DialogTitle>
                            <DialogDescription className="text-slate-500 dark:text-slate-400">
                                {__('Cerita tamu telah berhasil dihapus dari sistem secara permanen.')}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="w-full flex sm:justify-center mt-6">
                            <Button 
                                onClick={() => setShowSuccessDialog(false)}
                                className="w-full rounded-2xl h-12 bg-sky-500 hover:bg-sky-600 text-white font-bold"
                            >
                                {__('Tutup')}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </RestoAdminLayout>
    );
}
