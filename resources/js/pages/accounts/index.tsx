import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import RestoAdminLayout from '@/layouts/resto-admin-layout';
import { Users, Plus, Edit2, Trash2, X, ChefHat, Bike, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function AccountManagement({ staffs, kurirs, customers }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<any>(null);

    const { data, setData, post, put, delete: destroy, reset, processing, errors, clearErrors } = useForm({
        name: '',
        email: '',
        phone: '',
        role: 'customer',
        password: '',
    });

    const openCreateModal = () => {
        clearErrors();
        setEditingAccount(null);
        setData({
            name: '',
            email: '',
            phone: '',
            role: 'staff',
            password: '',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (account: any) => {
        clearErrors();
        setEditingAccount(account);
        setData({
            name: account.name,
            email: account.email,
            phone: account.phone || '',
            role: account.role,
            password: '', // Kept empty unless changing
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingAccount) {
            put(`/accounts/${editingAccount.id}`, {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post('/accounts', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus akun ini secara permanen?')) {
            destroy(`/accounts/${id}`);
        }
    };

    const renderAccountTable = (title: string, group: any[], icon: any, colorCode: string) => (
        <div className="mb-10">
            <h2 className={`font-semibold text-lg flex items-center gap-2 mb-4 ${colorCode}`}>
                {icon} {title} ({group.length})
            </h2>
            <div className="overflow-hidden rounded-xl border border-border bg-card/10 backdrop-blur-md shadow-xl">
                {group.length > 0 ? (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="border-b border-border bg-muted/20">
                                <TableRow className="hover:bg-transparent border-border">
                                    <TableHead className="font-semibold text-foreground/70">Tipe</TableHead>
                                    <TableHead className="font-semibold text-foreground/70">Nama</TableHead>
                                    <TableHead className="font-semibold text-foreground/70">Email & Kontak</TableHead>
                                    <TableHead className="text-right font-semibold text-foreground/70">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {group.map((acc: any) => (
                                    <TableRow key={acc.id} className="hover:bg-muted/30 border-border/50">
                                        <TableCell>
                                            <Badge variant="outline" className={`border-border uppercase tracking-widest text-[10px] ${colorCode} bg-transparent`}>
                                                {acc.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium text-foreground">
                                            {acc.name}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-foreground/80">{acc.email}</span>
                                                <span className="text-xs text-muted-foreground">{acc.phone || '-'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    onClick={() => openEditModal(acc)}
                                                    className="h-8 w-8 text-foreground/60 hover:text-foreground hover:bg-muted"
                                                >
                                                    <Edit2 size={16} />
                                                </Button>
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    onClick={() => handleDelete(acc.id)}
                                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
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
                    <div className="p-8 text-center text-muted-foreground text-sm">
                        Belum ada data untuk kategori ini.
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            <Head title="Manajemen Akun - RestoWeb Admin" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-foreground font-['Inter',sans-serif]">
                <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-['Playfair_Display',serif] text-3xl font-bold tracking-tight text-foreground/90">
                            Manajemen Akun
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Atur pengguna sistem, kru internal, jajaran kemitraan, dan direktori pelanggan.
                        </p>
                    </div>
                    <div className="flex w-full sm:w-auto items-center gap-3">
                        <Button 
                            onClick={openCreateModal}
                            className="shrink-0 bg-orange-500 hover:bg-orange-600 text-[#0A0A0B] font-semibold"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Personil Baru
                        </Button>
                    </div>
                </div>

                {renderAccountTable('Manajemen Staff & Kru Dapur', staffs, <ChefHat size={18} />, 'text-emerald-400')}
                {renderAccountTable('Mitra Armada Logistik (Kurir)', kurirs, <Bike size={18} />, 'text-cyan-400')}
                {renderAccountTable('Direktori Pelanggan', customers, <UserIcon size={18} />, 'text-violet-400')}
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        
                        <div className="pointer-events-none absolute left-0 top-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/20 blur-3xl"></div>
                        
                        <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
                            <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-foreground">
                                {editingAccount ? 'Ubah Profil Akun' : 'Pendaftaran Akun Baru'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                            <div>
                                <Label htmlFor="role" className="text-foreground/70">Wewenang / Role</Label>
                                <select 
                                    id="role" 
                                    value={data.role} 
                                    onChange={e => setData('role', e.target.value)}
                                    className="mt-1.5 flex h-10 w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="staff" className="bg-card">Staff / Kru</option>
                                    <option value="kurir" className="bg-card">Kurir Truk</option>
                                    <option value="customer" className="bg-card">Customer Registrasi</option>
                                </select>
                                {errors.role && <p className="mt-1 text-xs text-destructive">{errors.role}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name" className="text-foreground/70">Nama Lengkap</Label>
                                    <Input 
                                        id="name" 
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)}
                                        className="mt-1.5 bg-muted border-border text-foreground focus-visible:ring-orange-500"
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="phone" className="text-foreground/70">Telp (Opsional)</Label>
                                    <Input 
                                        id="phone" 
                                        value={data.phone} 
                                        onChange={e => setData('phone', e.target.value)}
                                        className="mt-1.5 bg-muted border-border text-foreground focus-visible:ring-orange-500"
                                    />
                                    {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                                </div>
                            </div>
                            
                            <div>
                                <Label htmlFor="email" className="text-foreground/70">Email Aktivasi</Label>
                                <Input 
                                    id="email" 
                                    type="email"
                                    value={data.email} 
                                    onChange={e => setData('email', e.target.value)}
                                    className="mt-1.5 bg-muted border-border text-foreground focus-visible:ring-orange-500"
                                    autoComplete="none"
                                />
                                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                            </div>
                            
                            <div>
                                <Label htmlFor="password" className="text-foreground/70">
                                    Password {editingAccount && <span className="text-xs text-muted-foreground">(Kosongkan jika tidak diubah)</span>}
                                </Label>
                                <Input 
                                    id="password" 
                                    type="password"
                                    value={data.password} 
                                    onChange={e => setData('password', e.target.value)}
                                    className="mt-1.5 bg-muted border-border text-foreground focus-visible:ring-orange-500"
                                    autoComplete="new-password"
                                />
                                {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
                            </div>
                            
                             <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-border">
                                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground hover:bg-muted">
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold">
                                    {processing ? 'Menyimpan...' : 'Simpan Konfigurasi'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

AccountManagement.layout = (page: React.ReactNode) => <RestoAdminLayout>{page}</RestoAdminLayout>;
