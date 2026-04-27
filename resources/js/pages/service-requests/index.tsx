import { Head, useHttp, router } from '@inertiajs/react';
import RestoAdminLayout from '@/layouts/resto-admin-layout';
import { Bell, Clock, CheckCircle2, PlayCircle, Loader2, UtensilsCrossed, AlertCircle, Sparkles, Receipt, Droplets, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/use-translations';

interface ServiceRequest {
    id: number;
    reservation_id: number;
    type: 'waiter' | 'bill' | 'refill' | 'napkins' | 'other';
    notes: string | null;
    status: 'pending' | 'ongoing' | 'resolved';
    created_at: string;
    resolved_at: string | null;
    reservation?: {
        id: number;
        customer_name: string;
        resto_table_id: number;
        resto_table?: {
            name: string;
        };
    };
}

interface PageProps {
    serviceRequests: ServiceRequest[];
}

export default function ServiceRequestsIndex({ serviceRequests }: PageProps) {
    const { __, locale } = useTranslations();
    const [activeRequests, setActiveRequests] = useState<ServiceRequest[]>(serviceRequests);
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const http = useHttp();

    function timeAgo(date: Date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) return __('baru saja');
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} ${__('menit yang lalu')}`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ${__('jam yang lalu')}`;
        return date.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US');
    }

    useEffect(() => {
        // Real-time Service Requests listener
        const channel = window.Echo.channel('service.requests')
            .listen('.service.request.created', (e: { serviceRequest: ServiceRequest }) => {
                setActiveRequests(prev => {
                    const exists = prev.find(r => r.id === e.serviceRequest.id);
                    if (exists) {
                        return prev.map(r => r.id === e.serviceRequest.id ? e.serviceRequest : r);
                    }
                    return [e.serviceRequest, ...prev];
                });
                toast.info(`${__('Permintaan Baru')}: ${e.serviceRequest.type.toUpperCase()} ${__('di Meja')} ${e.serviceRequest.reservation?.resto_table?.name || '?'}`);
            });

        return () => channel.stopListening('.service.request.created');
    }, []);

    const updateRequestStatus = (id: number, status: string) => {
        setLoadingId(id);
        http.setData({ status });
        http.patch(`/service-requests/${id}`, {
            onSuccess: () => {
                setActiveRequests(prev => 
                    prev.map(r => r.id === id ? { ...r, status: status as any } : r)
                        .filter(r => status !== 'resolved' ? true : r.id !== id)
                );
                toast.success(`${__('Permintaan')} #${id} ${__('diperbarui menjadi')} ${status.toUpperCase()}`);
            },
            onError: () => {
                toast.error(__('Gagal memperbarui status permintaan.'));
            },
            onFinish: () => setLoadingId(null)
        });
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'pending': return { color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: Bell };
            case 'ongoing': return { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Loader2 };
            case 'resolved': return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2 };
            default: return { color: 'text-white/40', bg: 'bg-white/5', border: 'border-white/10', icon: Info };
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'waiter': return <Bell className="text-rose-500" />;
            case 'bill': return <Receipt className="text-emerald-500" />;
            case 'refill': return <Droplets className="text-blue-500" />;
            case 'other': return <Sparkles className="text-purple-500" />;
            default: return <Bell />;
        }
    };

    return (
        <>
            <Head title={`${__('Service Activity Hub')} - Ocean's Resto`} />

            <div className="mx-auto max-w-7xl font-sans text-white pb-12">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="h-1 w-8 rounded-full bg-sky-500" />
                            <span className="text-[10px] font-black tracking-[0.3em] text-sky-500 uppercase">{__('Hospitality Center')}</span>
                        </div>
                        <h1 className="font-['Playfair_Display',serif] text-5xl font-black tracking-tighter text-white">
                            {__('Service')} <span className="text-white/40 italic font-serif">{__('Hub')}</span>
                        </h1>
                        <p className="mt-4 text-white/40 max-w-lg leading-relaxed font-medium">
                            {__('Kelola semua permintaan langsung dari meja pelanggan secara real-time. Pastikan setiap tamu mendapatkan pelayanan terbaik.')}
                        </p>
                    </div>
                    <div className="bg-white/5 rounded-3xl p-4 border border-white/10 backdrop-blur-xl flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500">
                            <Bell size={24} className="animate-pulse" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{__('Active Requests')}</p>
                            <p className="text-2xl font-black text-white tracking-tighter">{activeRequests.length}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] shadow-3xl backdrop-blur-3xl overflow-hidden ring-1 ring-white/5">
                    <div className="p-10 border-b border-white/5 bg-white/[0.01]">
                        <h2 className="text-2xl font-black text-white font-['Playfair_Display',serif] tracking-tight">{__('Antrean Permintaan')}</h2>
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">{__('Live Hospitality Stream')}</p>
                    </div>

                    <div className="divide-y divide-white/5">
                        {activeRequests.length > 0 ? (
                            activeRequests.map((request) => {
                                const status = getStatusInfo(request.status);
                                return (
                                    <div key={request.id} className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 hover:bg-white/[0.01] transition-colors relative group">
                                        <div className="flex gap-8 items-start">
                                            <div className="h-16 w-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                                                {getTypeIcon(request.type)}
                                            </div>
                                            <div className="text-left py-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-black text-white uppercase tracking-tight">{__('Meja')} {request.reservation?.resto_table?.name || 'N/A'}</h3>
                                                    <Badge className={`${status.bg} ${status.color} ${status.border} text-[9px] font-black uppercase tracking-widest px-3 py-1`}>
                                                        <status.icon className={`mr-1.5 h-3 w-3 ${request.status === 'ongoing' ? 'animate-spin' : ''}`} />
                                                        {request.status.toUpperCase()}
                                                    </Badge>
                                                </div>
                                                <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                                    <AlertCircle size={12} className="text-sky-500/60" />
                                                    {__('Target')}: {request.reservation?.customer_name || __('Anonymous Guest')}
                                                </p>
                                                {request.notes && (
                                                    <div className="mt-3 bg-white/5 rounded-xl px-4 py-2 border border-white/5 italic text-sm text-white/60">
                                                        "{request.notes}"
                                                    </div>
                                                )}
                                                <p className="text-[10px] text-white/20 font-bold mt-3 flex items-center gap-1.5 uppercase tracking-widest">
                                                    <Clock size={12} />
                                                    {timeAgo(new Date(request.created_at))}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 w-full md:w-auto">
                                            {request.status === 'pending' && (
                                                <Button 
                                                    onClick={() => updateRequestStatus(request.id, 'ongoing')}
                                                    disabled={loadingId === request.id}
                                                    className="w-full md:w-auto bg-blue-500 text-white hover:bg-blue-600 rounded-[1.25rem] px-8 py-6 text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-900/40 transition-all hover:scale-[1.02]"
                                                >
                                                    {loadingId === request.id ? <Loader2 className="animate-spin mr-2" /> : <PlayCircle className="mr-2" />}
                                                    {__('Tangani')}
                                                </Button>
                                            )}
                                            {request.status === 'ongoing' && (
                                                <Button 
                                                    onClick={() => updateRequestStatus(request.id, 'resolved')}
                                                    disabled={loadingId === request.id}
                                                    className="w-full md:w-auto bg-emerald-500 text-white hover:bg-emerald-600 rounded-[1.25rem] px-8 py-6 text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-900/40 transition-all hover:scale-[1.02]"
                                                >
                                                    {loadingId === request.id ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2" />}
                                                    {__('Selesaikan')}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-32 text-center text-white/10 flex flex-col items-center gap-6">
                                <div className="h-24 w-24 rounded-[2rem] bg-white/5 flex items-center justify-center mb-4">
                                    <Bell size={48} strokeWidth={1} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white/40 uppercase tracking-widest">{__('Hening Sempurna')}</h3>
                                    <p className="text-xs text-white/20 mt-2 max-w-xs mx-auto font-medium">{__('Semua tamu sedang menikmati masakan mereka tanpa gangguan.')}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

ServiceRequestsIndex.layout = (page: React.ReactNode) => <RestoAdminLayout>{page}</RestoAdminLayout>;
