import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';
import { dashboard } from '@/routes';
import AIChatbot from '@/components/app/ai-chatbot';
import { CalendarPlus } from 'lucide-react';
import HomeLiveChat from '@/components/app/home-live-chat';
import GlobalCustomerChat from '@/components/app/global-customer-chat';

// Sections
import BentoFeatures from './sections/bento-features';
import CTASection from './sections/cta-section';
import Footer from './sections/footer';
import Hero from './sections/hero';
import HowItWorks from './sections/how-it-works';
import InfoBar from './sections/info-bar';
import LocationHours from './sections/location-hours';
import Navbar from './sections/navbar';
import PhotoGallery from './sections/photo-gallery';
import SignatureDishes from './sections/signature-dishes';
import Testimonials from './sections/testimonials';

export default function Welcome({
    bestSellers = [],
    testimonials = [],
    reviews = [],
}: {
    bestSellers?: any[];
    testimonials?: any[];
    reviews?: any[];
}) {
    const { auth } = usePage().props as any;
    const dashboardUrl = dashboard().url;
    const mainRef = useRef<HTMLDivElement>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!mainRef.current) return;
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth) * 100;
        const y = (clientY / window.innerHeight) * 100;
        mainRef.current.style.setProperty('--mouse-x', `${x}%`);
        mainRef.current.style.setProperty('--mouse-y', `${y}%`);
    };

    return (
        <div 
            ref={mainRef}
            className="group/main relative bg-mesh min-h-screen overflow-x-hidden"
            onMouseMove={handleMouseMove}
        >
            <div className="grain-overlay" />
            <Head title="Ocean's Resto — Taste the Extraordinary">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-transparent font-['Inter',sans-serif] text-slate-800 dark:text-neutral-200 selection:bg-sky-100 selection:text-sky-900 dark:selection:bg-sky-500/30 dark:selection:text-sky-200 transition-colors duration-1000 relative">
                <Navbar
                    auth={auth}
                    dashboardUrl={dashboardUrl}
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                />
 
                <main className="relative z-10">
                    <Hero />
                    
                    <div className="space-y-16 md:space-y-32 pb-32 md:pb-64">
                        <BentoFeatures />
                        <SignatureDishes bestSellers={bestSellers || []} auth={auth} />
                        <HowItWorks />
                        <PhotoGallery />
                        <LocationHours />
                        <Testimonials testimonials={testimonials} reviews={reviews} auth={auth} />
                        <CTASection />
                    </div>
                </main>

                <Footer />

                <GlobalCustomerChat />
                <AIChatbot />

                {/* Mobile Floating Action Button (FAB) */}
                <div className="fixed bottom-24 right-6 z-50 md:hidden pointer-events-none">
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 2, type: "spring", stiffness: 260, damping: 20 }}
                        className="pointer-events-auto"
                    >
                        <Link href="/reservations/create">
                            <Button 
                                className="h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-[0_15px_30px_rgba(var(--color-primary),0.4)] flex items-center justify-center p-0 group overflow-hidden relative"
                            >
                                <motion.div
                                    animate={{ 
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 0.2, 0.5]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 bg-white rounded-full"
                                />
                                <CalendarPlus size={24} className="relative z-10" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
