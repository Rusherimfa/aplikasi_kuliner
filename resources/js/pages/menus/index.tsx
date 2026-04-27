import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import RestoAdminLayout from '@/layouts/resto-admin-layout';
import { Plus, Search, BookOpen, Edit2, Trash2, X, Check, EyeOff, Flame, Image as ImageIcon, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function MenuManagement({ menus, filters }: any) {
    const { auth } = usePage().props as any;
    const { __ } = useTranslations();
    const isStaff = auth.user.role === 'staff';
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState<any>(null);

    const { data, setData, post, put, delete: destroy, reset, processing, errors, clearErrors } = useForm({
        name: '',
        description: '',
        category: '',
        price: '',
        is_available: true,
        is_best_seller: false,
        image: null as File | null,
        _method: 'post' as string,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const categories = ['Main Course', 'Appetizer', 'Beverage', 'Dessert', 'Snack'];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/menus', { search: searchQuery }, { preserveState: true, replace: true });
    };

    const openCreateModal = () => {
        clearErrors();
        setEditingMenu(null);
        reset();
        setImagePreview(null);
        setData((prev) => ({ ...prev, is_available: true, is_best_seller: false, _method: 'post' }));
        setIsModalOpen(true);
    };

    const openEditModal = (menu: any) => {
        clearErrors();
        setEditingMenu(menu);
        setData({
            name: menu.name,
            description: menu.description || '',
            category: menu.category,
            price: menu.price,
            is_available: menu.is_available,
            is_best_seller: menu.is_best_seller || false,
            image: null,
            _method: 'put',
        });
        setImagePreview(menu.image_path ? `/storage/${menu.image_path}` : null);
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingMenu) {
            post(`/menus/${editingMenu.id}`, {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post('/menus', {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const toggleStatus = (menu: any, field: string) => {
        router.put(`/menus/${menu.id}`, {
            ...menu,
            [field]: !menu[field]
        }, { preserveScroll: true, preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm(__('Yakin ingin menghapus menu ini?'))) {
            destroy(`/menus/${id}`);
        }
    };

    const formatRupiah = (amount: any) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(parseFloat(amount));
    };

    return (
        <>
            <Head title={`${__('Manajemen Menu')} - Ocean's Resto Admin`} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-foreground font-['Inter',sans-serif]">
                <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-['Playfair_Display',serif] text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground/90">
                            {__('Katalog Menu')}
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
                            {__('Tambah, kurangi, atau ubah detail makanan yang ditawarkan.')}
                        </p>
                    </div>
                    <div className="flex w-full sm:w-auto items-center gap-3">
                        <form onSubmit={handleSearch} className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
                            <Input 
                                type="text"
                                placeholder="Cari sajian..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-slate-50 dark:bg-muted/50 border-slate-200 dark:border-border text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:text-muted-foreground/40 focus-visible:ring-sky-500"
                            />
                        </form>
                        {!isStaff && (
                            <Button 
                                onClick={openCreateModal}
                                className="shrink-0 bg-sky-500 hover:bg-sky-600 text-white dark:text-[#0A0A0B] font-semibold"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                {__('Tambah Menu')}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-card/10 backdrop-blur-md shadow-xl">
                    {menus.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="border-b border-slate-100 dark:border-border bg-slate-50 dark:bg-muted/20">
                                    <TableRow className="hover:bg-transparent border-slate-100 dark:border-border">
                                        <TableHead className="font-semibold text-slate-500 dark:text-foreground/70">{__('Menu Item')}</TableHead>
                                        <TableHead className="font-semibold text-slate-500 dark:text-foreground/70">{__('Kategori')}</TableHead>
                                        <TableHead className="font-semibold text-slate-500 dark:text-foreground/70">{__('Harga')}</TableHead>
                                        <TableHead className="font-semibold text-slate-500 dark:text-foreground/70">{__('Wujud')}</TableHead>
                                        <TableHead className="font-semibold text-slate-500 dark:text-foreground/70 text-center">{__('Terjual')}</TableHead>
                                        <TableHead className="text-right font-semibold text-slate-500 dark:text-foreground/70">{__('Aksi')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {menus.map((menu: any) => (
                                        <TableRow key={menu.id} className="hover:bg-slate-50 dark:hover:bg-muted/30 border-slate-100 dark:border-border/50">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-muted overflow-hidden border border-slate-200 dark:border-border">
                                                        {menu.image_path ? (
                                                            <img src={`/storage/${menu.image_path}`} className="h-full w-full object-cover" alt={menu.name} />
                                                        ) : (
                                                            <BookOpen size={18} className="text-slate-400 dark:text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900 dark:text-foreground/90 flex items-center gap-2">{menu.name} {menu.is_best_seller && <Flame size={14} className="text-rose-500" />}</p>
                                                        <p className="text-xs text-slate-500 dark:text-muted-foreground mt-0.5 truncate max-w-[200px]" title={menu.description}>{menu.description || __('Tidak ada deskripsi')}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="border-slate-200 dark:border-border text-slate-600 dark:text-foreground/70 bg-transparent">
                                                    {__(menu.category)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium text-sky-600 dark:text-sky-500">{formatRupiah(menu.price)}</span>
                                            </TableCell>
                                            <TableCell>
                                                {menu.is_available ? (
                                                    <span className="inline-flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                                        <Check size={14} className="mr-1" /> {__('Tersedia')}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center text-xs font-medium text-rose-400 opacity-70">
                                                        <EyeOff size={14} className="mr-1" /> {__('Habis (Hidden)')}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center font-black text-sky-600 dark:text-sky-500 bg-sky-500/5 sm:bg-transparent sm:border-l sm:border-r border-slate-100 dark:border-border min-w-[100px]">
                                                {menu.total_sold || 0} {__('porsi')}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {isStaff ? (
                                                    <div className="flex flex-col items-end gap-1.5">
                                                        <button 
                                                            onClick={() => toggleStatus(menu, 'is_available')}
                                                            className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border transition-colors ${menu.is_available ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20' : 'bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500/20'}`}
                                                        >
                                                            {menu.is_available ? __('Set Habis') : __('Set Tersedia')}
                                                        </button>
                                                        <button 
                                                            onClick={() => toggleStatus(menu, 'is_best_seller')}
                                                            className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border transition-colors ${menu.is_best_seller ? 'bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-500 hover:bg-sky-500/20' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 dark:text-white/40 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-600 dark:hover:text-white/60'}`}
                                                        >
                                                            {menu.is_best_seller ? '- Best Seller' : '+ Best Seller'}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button 
                                                            size="icon" 
                                                            variant="ghost" 
                                                            onClick={() => openEditModal(menu)}
                                                            className="h-8 w-8 text-slate-400 dark:text-foreground/60 hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-100 dark:hover:bg-muted"
                                                        >
                                                            <Edit2 size={16} />
                                                        </Button>
                                                        <Button 
                                                            size="icon" 
                                                            variant="ghost" 
                                                            onClick={() => handleDelete(menu.id)}
                                                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="p-16 flex flex-col items-center justify-center text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground/20">
                                <BookOpen size={28} />
                            </div>
                            <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-foreground/90">{__('Katalog Kosong')}</h3>
                            <p className="text-sm text-slate-500 dark:text-muted-foreground mb-6 max-w-sm">{__('Belum ada hidangan yang didaftarkan atau tidak ada kecocokan dari pencarianmu.')}</p>
                            <Button onClick={openCreateModal} className="bg-sky-500 hover:bg-sky-600 text-white dark:text-[#0A0A0B] font-semibold">
                                {__('Mulai Tambah Menu')}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Premium Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-border bg-white dark:bg-card p-6 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        
                        <div className="pointer-events-none absolute left-0 top-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/20 blur-3xl"></div>
                        
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-border pb-4 mb-5">
                            <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-slate-900 dark:text-foreground">
                                {editingMenu ? __('Edit Menu') : __('Menu Makanan Baru')}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-slate-400 dark:text-muted-foreground hover:bg-slate-100 dark:hover:bg-muted hover:text-slate-900 dark:hover:text-foreground transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name" className="text-slate-600 dark:text-foreground/70">{__('Nama Hidangan')}</Label>
                                <Input 
                                    id="name" 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)}
                                    className="mt-1.5 bg-slate-50 dark:bg-muted border-slate-200 dark:border-border text-slate-900 dark:text-foreground focus-visible:ring-sky-500"
                                    placeholder={__('Cth: Wagyu A5 Ribeye')}
                                />
                                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="category" className="text-slate-600 dark:text-foreground/70">{__('Kategori')}</Label>
                                    <select 
                                        id="category" 
                                        value={data.category} 
                                        onChange={e => setData('category', e.target.value)}
                                        className="mt-1.5 flex h-10 w-full rounded-md border border-slate-200 dark:border-border bg-slate-50 dark:bg-muted px-3 py-2 text-sm text-slate-900 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    >
                                        <option value="" className="bg-white dark:bg-card text-slate-400 dark:text-muted-foreground">{__('Pilih...')}</option>
                                        {categories.map(c => <option key={c} value={c} className="bg-white dark:bg-card">{c}</option>)}
                                    </select>
                                    {errors.category && <p className="mt-1 text-xs text-destructive">{errors.category}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="price" className="text-slate-600 dark:text-foreground/70">{__('Harga (Rp)')}</Label>
                                    <Input 
                                        id="price" 
                                        type="number"
                                        value={data.price} 
                                        onChange={e => setData('price', e.target.value)}
                                        className="mt-1.5 bg-slate-50 dark:bg-muted border-slate-200 dark:border-border text-slate-900 dark:text-foreground focus-visible:ring-sky-500"
                                        placeholder="75000"
                                    />
                                    {errors.price && <p className="mt-1 text-xs text-destructive">{errors.price}</p>}
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="description" className="text-slate-600 dark:text-foreground/70">{__('Deskripsi Singkat')}</Label>
                                <Textarea 
                                    id="description" 
                                    value={data.description} 
                                    onChange={e => setData('description', e.target.value)}
                                    className="mt-1.5 bg-slate-50 dark:bg-muted border-slate-200 dark:border-border text-slate-900 dark:text-foreground focus-visible:ring-sky-500 resize-none h-20"
                                    placeholder={__('Sajian istimewa dari dapur kami...')}
                                />
                            </div>

                            <div>
                                <Label className="text-slate-600 dark:text-foreground/70 mb-2 block">Foto Sajian</Label>
                                <div className="flex items-center gap-4">
                                    <div className="relative h-20 w-20 rounded-xl bg-slate-50 dark:bg-muted border border-slate-200 dark:border-border overflow-hidden flex items-center justify-center">
                                        {imagePreview ? (
                                            <img src={imagePreview} className="h-full w-full object-cover" alt="Preview" />
                                        ) : (
                                            <ImageIcon className="text-muted-foreground/20" size={24} />
                                        )}
                                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                            <Camera className="text-white" size={20} />
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setData('image', file);
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => setImagePreview(reader.result as string);
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                    <div className="flex-1 text-[10px] text-slate-500 dark:text-muted-foreground leading-relaxed">
                                        <p className="font-bold uppercase tracking-widest text-sky-600 dark:text-sky-500 mb-1">{__('Upload Visual')}</p>
                                        <p>{__('Gunakan gambar rasio 1:1 atau 4:5 untuk hasil terbaik. Maksimal 2MB.')}</p>
                                    </div>
                                </div>
                                {errors.image && <p className="mt-1 text-xs text-destructive">{errors.image}</p>}
                            </div>
                            
                            <div className="flex flex-col gap-3 pt-2">
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="checkbox" 
                                        id="is_available" 
                                        checked={data.is_available} 
                                        onChange={e => setData('is_available', e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 dark:border-border bg-slate-50 dark:bg-muted text-sky-500 focus:ring-sky-500 focus:ring-offset-0 focus:ring-offset-transparent"
                                    />
                                    <Label htmlFor="is_available" className="text-slate-700 dark:text-foreground cursor-pointer font-medium">{__('Tersedia untuk dipesan')}</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="checkbox" 
                                        id="is_best_seller" 
                                        checked={data.is_best_seller} 
                                        onChange={e => setData('is_best_seller', e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 dark:border-border bg-slate-50 dark:bg-muted text-sky-500 focus:ring-sky-500 focus:ring-offset-0 focus:ring-offset-transparent"
                                    />
                                    <Label htmlFor="is_best_seller" className="text-slate-700 dark:text-foreground cursor-pointer font-medium flex items-center gap-1.5"><Flame size={14} className="text-rose-500"/> {__('Tandai sebagai hidangan "Sangat Laris"')}</Label>
                                </div>
                            </div>

                              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-border">
                                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-slate-400 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-100 dark:hover:bg-muted">
                                    {__('Batal')}
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-sky-500 hover:bg-sky-600 text-white dark:text-zinc-950 font-bold">
                                    {processing ? __('Menyimpan...') : __('Simpan Menu')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

MenuManagement.layout = (page: React.ReactNode) => <RestoAdminLayout>{page}</RestoAdminLayout>;

