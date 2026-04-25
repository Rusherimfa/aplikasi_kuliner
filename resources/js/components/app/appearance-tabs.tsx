import type { LucideIcon } from 'lucide-react';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useTranslations } from '@/hooks/use-translations';

export default function AppearanceToggleTab() {
    const { appearance, updateAppearance } = useAppearance();
    const { __ } = useTranslations();

    const tabs: { value: Appearance; icon: LucideIcon; label: string; desc: string }[] = [
        { 
            value: 'light', 
            icon: Sun, 
            label: __('Crystal Ocean'), 
            desc: __('Pure, bright, and high readability')
        },
        { 
            value: 'dark', 
            icon: Moon, 
            label: __('Deep Sea'), 
            desc: __('Cinematic indigo and deep navy')
        },
        { 
            value: 'system', 
            icon: Monitor, 
            label: __('Adaptive Sync'), 
            desc: __('Follows your system environment')
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tabs.map(({ value, icon: Icon, label, desc }) => {
                const isActive = appearance === value;
                
                return (
                    <button
                        key={value}
                        onClick={() => updateAppearance(value)}
                        className="group relative text-left outline-none cursor-pointer"
                    >
                        <div className={cn(
                            "relative overflow-hidden rounded-[2rem] border-2 transition-all duration-500 h-48",
                            isActive 
                                ? "border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.2)] bg-purple-500/10 scale-[1.02]" 
                                : "border-black/5 dark:border-white/5 bg-muted/40 dark:bg-white/[0.03] hover:border-purple-500/30"
                        )}>
                            {/* Preview Elements */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-between">
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                                    isActive ? "bg-purple-500 text-white" : "bg-muted dark:bg-white/5 text-muted-foreground group-hover:text-purple-500"
                                )}>
                                    <Icon size={24} />
                                </div>
                                
                                <div className="space-y-1">
                                    <h4 className={cn(
                                        "text-sm font-black uppercase tracking-widest transition-colors",
                                        isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                                    )}>
                                        {label}
                                    </h4>
                                    <p className="text-[10px] font-medium text-muted-foreground/60 leading-tight">
                                        {desc}
                                    </p>
                                </div>
                            </div>

                            {/* Abstract Visual Elements based on theme */}
                            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                                {value === 'light' && (
                                    <div className="flex gap-1">
                                        <div className="h-8 w-8 rounded-full bg-orange-400 blur-xl" />
                                        <div className="h-12 w-12 rounded-full bg-sky-400 blur-xl" />
                                    </div>
                                )}
                                {value === 'dark' && (
                                    <div className="flex gap-1">
                                        <div className="h-8 w-8 rounded-full bg-indigo-600 blur-xl" />
                                        <div className="h-12 w-12 rounded-full bg-purple-600 blur-xl" />
                                    </div>
                                )}
                                {value === 'system' && (
                                    <div className="flex gap-1">
                                        <div className="h-8 w-8 rounded-full bg-sky-400 blur-xl" />
                                        <div className="h-12 w-12 rounded-full bg-indigo-600 blur-xl" />
                                    </div>
                                )}
                            </div>

                            {isActive && (
                                <motion.div 
                                    layoutId="active-glow"
                                    className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent pointer-events-none"
                                />
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
