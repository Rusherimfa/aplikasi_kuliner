import { Head, Link, usePage } from '@inertiajs/react';
import { UtensilsCrossed, ArrowLeft, Search, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { login } from '@/routes';

interface Menu {
    id: number;
    name: string;
    description: string | null;
    category: string;
    price: string;
}

interface PageProps {
    menus: Menu[];
    filters: {
        category?: string;
        search?: string;
    };
}

export default function CatalogIndex({ menus, filters }: PageProps) {
    const { auth } = usePage().props;
    const [activeCategory, setActiveCategory] = useState(
        filters.category || 'All',
    );
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    // Extract unique categories from menus for the filter tabs
    const categories = [
        'All',
        ...Array.from(new Set(menus.map((item) => item.category))),
    ];

    // Client-side filtering for immediate snappy response
    const filteredMenus = menus.filter((item) => {
        const matchesCategory =
            activeCategory === 'All' || item.category === activeCategory;
        const matchesSearch = item.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <>
            <Head title="Our Menu Catalog" />

            <div className="min-h-screen bg-[#FAFAFA] font-['Inter',sans-serif] text-slate-800">
                {/* Minimalist Catalog Header */}
                <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/"
                                    className="text-slate-500 transition-colors hover:text-slate-900"
                                >
                                    <ArrowLeft size={20} />
                                </Link>
                                <span className="flex items-center gap-2 font-['Playfair_Display',serif] text-xl font-bold tracking-tight text-slate-900">
                                    <UtensilsCrossed
                                        size={18}
                                        className="text-amber-700"
                                    />
                                    Our Catalog
                                </span>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="relative hidden w-64 sm:block">
                                    <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        type="search"
                                        placeholder="Search delicate dishes..."
                                        className="bg-slate-50/50 pl-9"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>
                                <Link href={auth.user ? '/dashboard' : login()}>
                                    <Button
                                        variant="outline"
                                        className="rounded-full border-slate-300"
                                    >
                                        <ShoppingBag
                                            size={16}
                                            className="mr-2"
                                        />
                                        Cart
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <h1 className="mb-4 font-['Playfair_Display',serif] text-4xl font-bold text-slate-900 sm:text-5xl">
                            Gastronomic Selection
                        </h1>
                        <p className="text-lg text-slate-600">
                            Explore our complete offerings. From light
                            appetizers to signature mains, everything is
                            prepared to perfection.
                        </p>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                                    activeCategory === category
                                        ? 'bg-amber-700 text-white shadow-md shadow-amber-900/10'
                                        : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Catalog Grid */}
                    {filteredMenus.length > 0 ? (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {filteredMenus.map((item) => (
                                <div
                                    key={item.id}
                                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/5"
                                >
                                    <div className="relative aspect-square overflow-hidden bg-slate-100">
                                        {/* Image placeholder */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-slate-300 transition-transform duration-700 group-hover:scale-110">
                                            <UtensilsCrossed
                                                size={48}
                                                className="opacity-20"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="mb-2 flex items-start justify-between gap-2">
                                            <h3 className="text-lg leading-tight font-semibold text-slate-900">
                                                {item.name}
                                            </h3>
                                            <span className="font-bold whitespace-nowrap text-amber-700">
                                                Rp{' '}
                                                {Number(
                                                    item.price,
                                                ).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <p className="mb-6 line-clamp-3 flex-1 text-sm text-slate-500">
                                            {item.description ||
                                                'A wonderful addition to your dining experience engineered by our top chefs.'}
                                        </p>

                                        <Link
                                            href={auth.user ? '#' : login()}
                                            className="mt-auto"
                                        >
                                            <Button
                                                variant="outline"
                                                className="w-full rounded-xl border-slate-200 text-slate-700 transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                                            >
                                                + Add to Cart
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed border-slate-100 bg-white py-20 text-center">
                            <UtensilsCrossed
                                size={48}
                                className="mx-auto mb-4 text-slate-300"
                            />
                            <h3 className="mb-2 text-lg font-medium text-slate-900">
                                No items found
                            </h3>
                            <p className="text-slate-500">
                                We couldn't find any dishes matching your
                                criteria.
                            </p>
                            <Button
                                variant="outline"
                                className="mt-6 rounded-full"
                                onClick={() => {
                                    setActiveCategory('All');
                                    setSearchTerm('');
                                }}
                            >
                                Reset Filters
                            </Button>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
