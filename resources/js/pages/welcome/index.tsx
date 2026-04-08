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

export default function Welcome({
    bestSellers = [],
}: {
    bestSellers?: any[];
}) {
    const { auth, currentTeam } = usePage().props;
    const dashboardUrl = currentTeam ? dashboard(currentTeam.slug).url : '/';
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

            <div className="min-h-screen bg-[#FAFAFA] font-['Inter',sans-serif] text-slate-800 selection:bg-amber-100 selection:text-amber-900">
                <Navbar
                    auth={auth}
                    dashboardUrl={dashboardUrl}
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                />

                <Hero />

                <InfoBar />

                <SignatureDishes bestSellers={bestSellers} auth={auth} />

                <PhotoGallery />

                <HowItWorks />

                <Testimonials />

                <CTASection />

                <Footer />
            </div>
        </>
    );
}
