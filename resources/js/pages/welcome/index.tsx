import { Head, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { dashboard } from '@/routes';

// Sections
import CTASection from './sections/cta-section';
import Footer from './sections/footer';
import Hero from './sections/hero';
import HowItWorks from './sections/how-it-works';
import InfoBar from './sections/info-bar';
import Navbar from './sections/navbar';
import PhotoGallery from './sections/photo-gallery';
import SignatureDishes from './sections/signature-dishes';
import Testimonials from './sections/testimonials';
import BentoFeatures from './sections/bento-features';
import LocationHours from './sections/location-hours';
import AIChatbot from '@/components/app/ai-chatbot';

export default function Welcome({
    bestSellers = [],
    testimonials = [],
    reviews = []
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
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-transparent font-['Inter',sans-serif] text-slate-800 dark:text-neutral-200 selection:bg-sky-100 selection:text-sky-900 dark:selection:bg-sky-500/30 dark:selection:text-sky-200 transition-colors duration-500 relative">
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

                    <CTASection />
                </main>

                <Footer />
                
                <AIChatbot />
            </div>
        </div>
    );
}

