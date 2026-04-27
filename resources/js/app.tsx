import { createInertiaApp, router } from '@inertiajs/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import { CartProvider } from '@/hooks/use-cart';
import AppLayout from '@/layouts/app-layout';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Toaster } from 'sonner';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import SmoothScroll from '@/components/app/smooth-scroll';
import '@/echo';

// Refresh ScrollTrigger on each navigation finish
router.on('finish', () => {
    ScrollTrigger.refresh();
});

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome' || name === 'welcome/index':
            case name.startsWith('experience'):
            case name.startsWith('menu'):
            case name.startsWith('catalog'):
            case name.startsWith('reservations'):
            case name.startsWith('testimonials'):
            case name.startsWith('checkout'):
            case name.startsWith('orders'):
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
            case name.startsWith('teams/'):
                return SettingsLayout;
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <CartProvider>
                <TooltipProvider delayDuration={0}>
                    <SmoothScroll>
                        {app}
                    </SmoothScroll>
                    <Toaster position="bottom-right" theme="system" closeButton richColors />
                </TooltipProvider>
            </CartProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
