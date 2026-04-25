import AppLogoIcon from '@/components/app/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-10 items-center justify-center rounded-full bg-white/10 p-0.5 overflow-hidden shadow-md">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover rounded-full drop-shadow-md" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Ocean's Resto
                </span>
            </div>
        </>
    );
}

