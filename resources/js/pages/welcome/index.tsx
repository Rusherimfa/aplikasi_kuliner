import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <Head title="RestoWeb — Taste the Extraordinary">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-[#FAFAFA] dark:bg-neutral-950 font-['Inter',sans-serif] text-slate-800 dark:text-neutral-200 selection:bg-orange-100 selection:text-orange-900 dark:selection:bg-orange-500/30 dark:selection:text-orange-200 transition-colors duration-500">
                <Navbar
                    auth={auth}
                    dashboardUrl={dashboardUrl}
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                />

                <Hero />

                <InfoBar />

                <BentoFeatures />

                <SignatureDishes bestSellers={bestSellers} auth={auth} />

                <PhotoGallery />

                <HowItWorks />

                <LocationHours />

                <Testimonials testimonials={testimonials} reviews={reviews} auth={auth} />

                <CTASection />

                <Footer />
                
                <AIChatbot />
            </div>
        </>
    );
}
