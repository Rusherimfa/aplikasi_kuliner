import { Head, router, usePage } from '@inertiajs/react';
import AppearanceTabs from '@/components/app/appearance-tabs';
import { edit as editAppearance } from '@/routes/appearance';
import { Monitor, Palette, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';
import SettingsLayout from '@/layouts/settings/layout';
import localeHelper from '@/routes/locale';

export default function Appearance() {
    const { __ } = useTranslations();
    const { props } = usePage();
    const { locale } = props as any;

    return (
        <>
            <Head title={__('Visual Aesthetics')} />
            
            <div className="space-y-12 pb-20 sm:pb-0">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="rounded-[3rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-8 sm:p-12 shadow-xl dark:shadow-2xl backdrop-blur-xl ring-1 ring-slate-100 dark:ring-transparent"
                >
                    <div className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                                <Palette size={32} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-foreground uppercase italic">{__('Interface Protocol')}</h2>
                                <p className="text-slate-500 dark:text-muted-foreground/60 font-medium">{__('Calibrate the visual spectrum of your digital environment.')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
                            <Sparkles size={14} className="text-purple-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">{__('Dynamic Atmosphere')}</span>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="rounded-[2rem] border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 p-8">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-purple-600 dark:text-purple-500/70 mb-8 ml-2">{__('Select Visual Mode')}</h3>
                            <AppearanceTabs />
                        </div>

                        <div className="rounded-[2rem] border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 p-8">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-purple-600 dark:text-purple-500/70 mb-8 ml-2">{__('Language Protocol')}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { id: 'id', name: __('Bahasa Indonesia'), flag: '🇮🇩', desc: __('Lokalisasi penuh Indonesia') },
                                    { id: 'en', name: __('English (US)'), flag: '🇺🇸', desc: __('Standard global English') }
                                ].map((lang) => (
                                    <button
                                        key={lang.id}
                                        onClick={() => 
router.post(localeHelper.update.url(), { locale: lang.id })}
                                        className={cn(
                                            "relative flex flex-col items-start p-6 rounded-2xl border transition-all duration-500 group overflow-hidden",
                                            locale === lang.id 
                                                ? "bg-purple-600 text-white border-purple-500 shadow-[0_10px_30px_rgba(168,85,247,0.3)] ring-4 ring-purple-600/20" 
                                                : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 hover:border-purple-500/50 hover:bg-purple-500/5 shadow-sm"
                                        )}
                                    >
                                        <div className="flex items-center justify-between w-full mb-2 relative z-10">
                                            <span className="text-2xl">{lang.flag}</span>
                                            {locale === lang.id && (
                                                <motion.div layoutId="lang-check" className="h-6 w-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                                    <CheckCircle2 size={14} className="text-white" />
                                                </motion.div>
                                            )}
                                        </div>
                                        <span className={cn("text-sm font-black uppercase tracking-widest relative z-10", locale === lang.id ? "text-white" : "text-slate-900 dark:text-foreground")}>
                                            {lang.name}
                                        </span>
                                        <p className={cn("text-[10px] font-medium mt-1 relative z-10", locale === lang.id ? "text-white/70" : "text-slate-500 dark:text-muted-foreground/60")}>
                                            {lang.desc}
                                        </p>
                                        {locale !== lang.id && (
                                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
     </div>

                        <div className="p-8 rounded-[2rem] bg-gradient-to-br from-purple-500/5 to-transparent border border-slate-200 dark:border-purple-500/10">
                            <div className="flex items-start gap-4">
                                <Monitor className="mt-1 text-purple-600 dark:text-purple-500 shrink-0" size={20} />
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-slate-900 dark:text-foreground">{__('Adaptive Intelligence')}</p>
                                    <p className="text-xs text-slate-500 dark:text-muted-foreground leading-relaxed">
                                        {__('Choosing System Mode will allow the interface to automatically sync with your operating system\'s circadian cycle, shifting between modes as day turns to night.')}
                                    </p>
                                </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}

Appearance.layout = (page: any) => (
    <SettingsLayout>{page}</SettingsLayout>
);
