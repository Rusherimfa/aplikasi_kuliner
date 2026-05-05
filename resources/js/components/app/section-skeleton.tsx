import { motion } from 'framer-motion';

export default function SectionSkeleton() {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-20 animate-pulse">
            <div className="h-4 w-32 bg-slate-200 dark:bg-white/5 rounded-full mb-6" />
            <div className="h-20 w-3/4 bg-slate-200 dark:bg-white/5 rounded-3xl mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-[4/5] rounded-2xl bg-slate-200 dark:bg-white/5" />
                ))}
            </div>
        </div>
    );
}
