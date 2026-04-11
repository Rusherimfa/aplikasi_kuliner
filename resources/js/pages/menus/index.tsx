import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import RestoAdminLayout from '@/layouts/resto-admin-layout';
import { Plus, Search, BookOpen, Edit2, Trash2, X, Check, EyeOff, Flame } from 'lucide-react';
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
    });

    const categories = ['Main Course', 'Appetizer', 'Beverage', 'Dessert', 'Snack'];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/menus', { search: searchQuery }, { preserveState: true, replace: true });
    };

    const openCreateModal = () => {
        clearErrors();
        setEditingMenu(null);
        reset();
        setData((prev) => ({ ...prev, is_available: true, is_best_seller: false }));
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
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingMenu) {
            put(`/menus/${editingMenu.id}`, {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post('/menus', {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus menu ini?')) {
            destroy(`/menus/${id}`);
        }
    };

    const formatRupiah = (amount: any) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(parseFloat(amount));
    };

    return (
        <>
            <Head title="Manajemen Menu - RestoWeb Admin" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-white font-['Inter',sans-serif]">
                <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-['Playfair_Display',serif] text-3xl font-bold tracking-tight text-white/90">
                            Katalog Menu
                        </h1>
                        <p className="mt-1 text-sm text-white/50">
                            Tambah, kurangi, atau ubah detail makanan yang ditawarkan.
                        </p>
                    </div>
                    <div className="flex w-full sm:w-auto items-center gap-3">
                        <form onSubmit={handleSearch} className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                            <Input 
                                type="text"
                                placeholder="Cari sajian..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-amber-500"
                            />
                        </form>
                        <Button 
                            onClick={openCreateModal}
                            className="shrink-0 bg-amber-500 hover:bg-amber-600 text-[#0A0A0B] font-semibold"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Menu
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-md shadow-xl">
                    {menus.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="border-b border-white/5 bg-white/5">
                                    <TableRow className="hover:bg-transparent border-white/5">
                                        <TableHead className="font-semibold text-white/70">Menu Item</TableHead>
                                        <TableHead className="font-semibold text-white/70">Kategori</TableHead>
                                        <TableHead className="font-semibold text-white/70">Harga</TableHead>
                                        <TableHead className="font-semibold text-white/70">Wujud</TableHead>
                                        <TableHead className="text-right font-semibold text-white/70">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {menus.map((menu: any) => (
                                        <TableRow key={menu.id} className="hover:bg-white/5 border-white/5">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/50">
                                                        <BookOpen size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-white/90 flex items-center gap-2">{menu.name} {menu.is_best_seller && <Flame size={14} className="text-rose-500" title="Sangat Laris" />}</p>
                                                        <p className="text-xs text-white/50 mt-0.5 truncate max-w-[200px]" title={menu.description}>{menu.description || "Tidak ada deksripsi"}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="border-white/10 text-white/70 bg-transparent">
                                                    {menu.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium text-amber-500">{formatRupiah(menu.price)}</span>
                                            </TableCell>
                                            <TableCell>
                                                {menu.is_available ? (
                                                    <span className="inline-flex items-center text-xs font-medium text-emerald-400">
                                                        <Check size={14} className="mr-1" /> Tersedia
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center text-xs font-medium text-rose-400 opacity-70">
                                                        <EyeOff size={14} className="mr-1" /> Habis (Hidden)
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        onClick={() => openEditModal(menu)}
                                                        className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
                                                    >
                                                        <Edit2 size={16} />
                                                    </Button>
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        onClick={() => handleDelete(menu.id)}
                                                        className="h-8 w-8 text-rose-500/80 hover:text-rose-500 hover:bg-rose-500/10"
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="p-16 flex flex-col items-center justify-center text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-white/20">
                                <BookOpen size={28} />
                            </div>
                            <h3 className="mb-1 text-lg font-semibold text-white/90">Katalog Kosong</h3>
                            <p className="text-sm text-white/50 mb-6 max-w-sm">Belum ada hidangan yang didaftarkan atau tidak ada kecocokan dari pencarianmu.</p>
                            <Button onClick={openCreateModal} className="bg-amber-500 hover:bg-amber-600 text-[#0A0A0B] font-semibold">
                                Mulai Tambah Menu
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Premium Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#121214] p-6 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        
                        <div className="pointer-events-none absolute left-0 top-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/20 blur-3xl"></div>
                        
                        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                            <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-white">
                                {editingMenu ? 'Edit Menu' : 'Menu Makanan Baru'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-white/50 hover:bg-white/5 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name" className="text-white/70">Nama Hidangan</Label>
                                <Input 
                                    id="name" 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)}
                                    className="mt-1.5 bg-white/5 border-white/10 text-white focus-visible:ring-amber-500"
                                    placeholder="Cth: Wagyu A5 Ribeye"
                                />
                                {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="category" className="text-white/70">Kategori</Label>
                                    <select 
                                        id="category" 
                                        value={data.category} 
                                        onChange={e => setData('category', e.target.value)}
                                        className="mt-1.5 flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    >
                                        <option value="" className="bg-[#121214] text-white/50">Pilih...</option>
                                        {categories.map(c => <option key={c} value={c} className="bg-[#121214]">{c}</option>)}
                                    </select>
                                    {errors.category && <p className="mt-1 text-xs text-rose-500">{errors.category}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="price" className="text-white/70">Harga (Rp)</Label>
                                    <Input 
                                        id="price" 
                                        type="number"
                                        value={data.price} 
                                        onChange={e => setData('price', e.target.value)}
                                        className="mt-1.5 bg-white/5 border-white/10 text-white focus-visible:ring-amber-500"
                                        placeholder="75000"
                                    />
                                    {errors.price && <p className="mt-1 text-xs text-rose-500">{errors.price}</p>}
                                </div>
                            </div>
                            
                            <div>
                                <Label htmlFor="description" className="text-white/70">Deskripsi Singkat</Label>
                                <Textarea 
                                    id="description" 
                                    value={data.description} 
                                    onChange={e => setData('description', e.target.value)}
                                    className="mt-1.5 bg-white/5 border-white/10 text-white focus-visible:ring-amber-500 resize-none h-20"
                                    placeholder="Sajian istimewa dari dapur kami..."
                                />
                                {errors.description && <p className="mt-1 text-xs text-rose-500">{errors.description}</p>}
                            </div>
                            
                            <div className="flex flex-col gap-3 pt-2">
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="checkbox" 
                                        id="is_available" 
                                        checked={data.is_available} 
                                        onChange={e => setData('is_available', e.target.checked)}
                                        className="h-4 w-4 rounded border-white/10 bg-white/5 text-amber-500 focus:ring-amber-500 focus:ring-offset-0 focus:ring-offset-transparent"
                                    />
                                    <Label htmlFor="is_available" className="text-white cursor-pointer font-medium">Tersedia untuk dipesan</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="checkbox" 
                                        id="is_best_seller" 
                                        checked={data.is_best_seller} 
                                        onChange={e => setData('is_best_seller', e.target.checked)}
                                        className="h-4 w-4 rounded border-white/10 bg-white/5 text-amber-500 focus:ring-amber-500 focus:ring-offset-0 focus:ring-offset-transparent"
                                    />
                                    <Label htmlFor="is_best_seller" className="text-white cursor-pointer font-medium flex items-center gap-1.5"><Flame size={14} className="text-rose-500"/> Tandai sebagai hidangan "Sangat Laris"</Label>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-white/5">
                                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white hover:bg-white/5">
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-amber-500 hover:bg-amber-600 text-[#0A0A0B] font-bold">
                                    {processing ? 'Menyimpan...' : 'Simpan Menu'}
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
