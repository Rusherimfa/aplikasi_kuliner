import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AIChatbot from '@/components/app/ai-chatbot';
import GuestSupportChat from '@/components/app/guest-support-chat';
import HomeLiveChat from '@/components/app/home-live-chat';
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <Head title="Ocean's Resto â€” Taste the Extraordinary">
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

            <div className="min-h-screen bg-[#FAFAFA] font-['Inter',sans-serif] text-slate-800 transition-colors duration-500 selection:bg-sky-100 selection:text-sky-900 dark:bg-neutral-950 dark:text-neutral-200 dark:selection:bg-sky-500/30 dark:selection:text-sky-200">
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

                <Testimonials
                    testimonials={testimonials}
                    reviews={reviews}
                    auth={auth}
                />

                <CTASection />

                <Footer />

                {auth.user ? (
                    <HomeLiveChat currentUser={auth.user} />
                ) : (
                    <GuestSupportChat />
                )}
                <AIChatbot />
            </div>
        </>
    );
}
