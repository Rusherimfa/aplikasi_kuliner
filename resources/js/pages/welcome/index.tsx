<<<<<<< HEAD
import { Head, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
=======
﻿import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AIChatbot from '@/components/app/ai-chatbot';
import GuestSupportChat from '@/components/app/guest-support-chat';
import HomeLiveChat from '@/components/app/home-live-chat';
>>>>>>> 854faaa89de91e541e11f652cb2fc3d468ba2b2c
import { dashboard } from '@/routes';

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
            className="group/main relative"
            onMouseMove={handleMouseMove}
        >
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

<<<<<<< HEAD
            <div className="min-h-screen bg-transparent font-['Inter',sans-serif] text-slate-800 dark:text-neutral-200 selection:bg-sky-100 selection:text-sky-900 dark:selection:bg-sky-500/30 dark:selection:text-sky-200 transition-colors duration-500 relative">
=======
            <div className="min-h-screen bg-[#FAFAFA] font-['Inter',sans-serif] text-slate-800 transition-colors duration-500 selection:bg-sky-100 selection:text-sky-900 dark:bg-neutral-950 dark:text-neutral-200 dark:selection:bg-sky-500/30 dark:selection:text-sky-200">
>>>>>>> 854faaa89de91e541e11f652cb2fc3d468ba2b2c
                <Navbar
                    auth={auth}
                    dashboardUrl={dashboardUrl}
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                />

                <main className="relative z-10 space-y-32">
                    <Hero />
                    
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <BentoFeatures />
                    </div>

                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <SignatureDishes bestSellers={bestSellers} auth={auth} />
                    </div>

                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <PhotoGallery />
                    </div>

                    <LocationHours />
                    
                    <Testimonials testimonials={testimonials} reviews={reviews} auth={auth} />

<<<<<<< HEAD
                    <CTASection />
                </main>
=======
                <PhotoGallery />

                <HowItWorks />

                <LocationHours />

                <Testimonials
                    testimonials={testimonials}
                    reviews={reviews}
                    auth={auth}
                />

                <CTASection />
>>>>>>> 854faaa89de91e541e11f652cb2fc3d468ba2b2c

                <Footer />

                {auth.user ? (
                    <HomeLiveChat currentUser={auth.user} />
                ) : (
                    <GuestSupportChat />
                )}
                <AIChatbot />
            </div>
        </div>
    );
}
