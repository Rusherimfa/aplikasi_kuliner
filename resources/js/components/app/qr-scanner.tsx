import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/use-translations';
import { QrCode, X, Loader2, Camera, RefreshCw } from 'lucide-react';

interface QRScannerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function QRScanner({ open, onOpenChange }: QRScannerProps) {
    const { __ } = useTranslations();
    const [isLoading, setIsLoading] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
    const containerId = 'qr-reader-core';

    const stopCamera = async () => {
        if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
            try {
                await html5QrCodeRef.current.stop();
                setCameraActive(false);
            } catch (err) {
                console.error("Failed to stop scanner", err);
            }
        }
    };

    const startCamera = async () => {
        setError(null);
        setIsLoading(true);
        
        try {
            if (!html5QrCodeRef.current) {
                html5QrCodeRef.current = new Html5Qrcode(containerId);
            }

            const config = { 
                fps: 10, 
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            };

            await html5QrCodeRef.current.start(
                { facingMode: "environment" }, 
                config, 
                onScanSuccess, 
                onScanFailure
            );
            
            setCameraActive(true);
        } catch (err: any) {
            console.error("Camera start error:", err);
            setError(err.message || __('Gagal mengakses kamera. Pastikan izin kamera diberikan.'));
            toast.error(__('Akses kamera ditolak atau tidak tersedia.'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            // Wait for DOM to be ready
            const timer = setTimeout(() => {
                startCamera();
            }, 500);
            return () => {
                clearTimeout(timer);
                stopCamera();
            };
        } else {
            stopCamera();
        }
    }, [open]);

    const onScanSuccess = (decodedText: string) => {
        stopCamera();
        setIsLoading(true);
        
        let token = decodedText;
        if (decodedText.includes('/checkin/')) {
            const parts = decodedText.split('/checkin/');
            token = parts[parts.length - 1];
        }

        router.get(`/checkin/${token}`, {}, {
            onSuccess: () => {
                onOpenChange(false);
                toast.success(__('Check-in berhasil!'));
            },
            onError: () => {
                toast.error(__('Gagal check-in. Kode tidak valid.'));
                // Restart camera after error
                startCamera();
            },
            onFinish: () => {
                setIsLoading(false);
            }
        });
    };

    const onScanFailure = () => {
        // Silently ignore
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-[#0A0A0B] border-slate-200 dark:border-white/5 text-slate-900 dark:text-white p-0 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                    <DialogHeader>
                        <DialogTitle className="font-['Playfair_Display',serif] text-2xl font-bold flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
                                <QrCode size={24} />
                            </div>
                            {__('Scan QR Check-in')}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 dark:text-white/40 mt-2">
                            {__('Posisikan kode QR di dalam kotak scanner.')}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8">
                    <div className="relative rounded-[2rem] overflow-hidden bg-slate-900 aspect-square border-4 border-slate-100 dark:border-white/5 shadow-inner flex flex-col items-center justify-center">
                        {isLoading && (
                            <div className="absolute inset-0 z-50 bg-slate-900/80 flex flex-col items-center justify-center backdrop-blur-md">
                                <Loader2 className="h-10 w-10 text-sky-500 animate-spin mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white animate-pulse">
                                    {__('Menghubungkan Kamera...')}
                                </p>
                            </div>
                        )}

                        {error && !isLoading && (
                            <div className="absolute inset-0 z-40 bg-slate-900 flex flex-col items-center justify-center p-8 text-center">
                                <div className="p-4 rounded-full bg-rose-500/10 text-rose-500 mb-4">
                                    <Camera size={32} />
                                </div>
                                <p className="text-sm font-medium text-slate-300 mb-6">{error}</p>
                                <Button 
                                    onClick={startCamera}
                                    className="bg-sky-500 hover:bg-sky-600 text-black font-black text-[10px] uppercase tracking-widest rounded-xl px-6"
                                >
                                    <RefreshCw size={14} className="mr-2" /> {__('Coba Lagi')}
                                </Button>
                            </div>
                        )}
                        
                        <div id={containerId} className="w-full h-full object-cover"></div>
                        
                        {/* Scan Area Overlay */}
                        {cameraActive && !isLoading && (
                            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
                                <div className="w-64 h-64 border-2 border-sky-500/50 rounded-3xl relative">
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-sky-500 -mt-1 -ml-1 rounded-tl-xl"></div>
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-sky-500 -mt-1 -mr-1 rounded-tr-xl"></div>
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-sky-500 -mb-1 -ml-1 rounded-bl-xl"></div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-sky-500 -mb-1 -mr-1 rounded-br-xl"></div>
                                    
                                    {/* Scan Line Animation */}
                                    <div className="absolute left-0 right-0 top-0 h-1 bg-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.5)] animate-[scan_2s_linear_infinite]"></div>
                                </div>
                                <p className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                                    {__('Scanning for QR Code...')}
                                </p>
                            </div>
                        )}

                        <style dangerouslySetInnerHTML={{ __html: `
                            @keyframes scan {
                                0% { top: 0%; }
                                50% { top: 100%; }
                                100% { top: 0%; }
                            }
                            #${containerId} video {
                                width: 100% !important;
                                height: 100% !important;
                                object-fit: cover !important;
                                border-radius: 1.5rem !important;
                            }
                            /* Hide library's default overlay elements */
                            #${containerId}__scan_region {
                                border: none !important;
                            }
                            #${containerId} > div > div:nth-child(2) {
                                display: none !important;
                            }
                            /* Hide the white corner borders from html5-qrcode */
                            #${containerId} b {
                                display: none !important;
                            }
                        `}} />
                    </div>

                    <div className="mt-8 flex justify-center">
                        <Button 
                            variant="ghost" 
                            onClick={() => onOpenChange(false)}
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 transition-all rounded-xl"
                        >
                            <X size={14} className="mr-2" /> {__('Tutup Scanner')}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}


