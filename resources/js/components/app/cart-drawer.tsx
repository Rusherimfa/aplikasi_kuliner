import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Minus, Plus, ShoppingBag, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Link, usePage } from '@inertiajs/react';
import { useTranslations } from '@/hooks/use-translations';

export default function CartDrawer() {
    const { isCartOpen, setCartOpen, items, removeItem, updateQuantity, cartTotal } = useCart();
    const { auth, locale } = usePage().props as any;
    const { __ } = useTranslations();

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString(locale === 'id' ? 'id-ID' : 'en-US', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).replace('IDR', 'Rp');
    };

    return (
        <Transition.Root show={isCartOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={setCartOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/60 transition-opacity backdrop-blur-sm" />
                </Transition.Child>
 
                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col bg-card shadow-2xl transition-colors duration-500">
                                        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-xl font-['Playfair_Display',serif] font-bold text-foreground flex items-center gap-2">
                                                    <ShoppingBag size={24} className="text-sky-500" />
                                                    {__('Your Selection')}
                                                </Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="relative -m-2 p-2 text-muted-foreground hover:text-foreground transition-colors"
                                                        onClick={() => setCartOpen(false)}
                                                    >
                                                        <span className="absolute -inset-0.5" />
                                                        <span className="sr-only">Close panel</span>
                                                        <X className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-8">
                                                {items.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                                        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
                                                            <UtensilsCrossed size={40} className="text-muted-foreground/40" />
                                                        </div>
                                                        <h3 className="text-lg font-medium text-foreground mb-2">{__('Empty Cart')}</h3>
                                                        <p className="text-muted-foreground max-w-[200px]">
                                                            {__('Please browse our catalog to add gourmet dishes.')}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="flow-root">
                                                        <ul role="list" className="-my-6 divide-y divide-border">
                                                            {items.map((item) => (
                                                                 <li key={item.id} className="flex py-6">
                                                                     <div className="flex flex-1 flex-col">
                                                                         <div>
                                                                             <div className="flex justify-between text-base font-semibold text-foreground">
                                                                                 <h4 className="line-clamp-2 pr-4">{item.name}</h4>
                                                                                 <p className="ml-4 whitespace-nowrap text-sky-600">
                                                                                     {formatCurrency(Number(item.price) * item.quantity)}
                                                                                 </p>
                                                                             </div>
                                                                         </div>
                                                                         <div className="flex flex-1 items-end justify-between text-sm mt-4">
                                                                             <div className="flex items-center gap-3 rounded-full border border-border bg-background p-1 shadow-sm">
                                                                                 <button
                                                                                     onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                                     className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
                                                                                 >
                                                                                     <Minus size={14} />
                                                                                 </button>
                                                                                 <span className="w-4 text-center font-medium text-foreground">{item.quantity}</span>
                                                                                 <button
                                                                                     onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                                     className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 hover:bg-sky-500/20"
                                                                                 >
                                                                                     <Plus size={14} />
                                                                                 </button>
                                                                             </div>

                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removeItem(item.id)}
                                                                                className="font-medium text-red-500 hover:text-red-700 transition-colors"
                                                                            >
                                                                                {__('Remove')}
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {items.length > 0 && (
                                            <div className="border-t border-border bg-card px-4 py-6 sm:px-6">
                                                <div className="flex justify-between text-lg font-bold text-foreground mb-6">
                                                    <p>{__('Order Total')}</p>
                                                    <p className="text-sky-600">{formatCurrency(cartTotal)}</p>
                                                </div>
                                                {auth?.user ? (
                                                    <Link href="/checkout" onClick={() => setCartOpen(false)}>
                                                        <Button className="w-full flex items-center justify-center h-14 rounded-full bg-gradient-to-r from-sky-500 to-sky-700 text-lg font-semibold text-white shadow-xl shadow-sky-900/20 hover:from-sky-400 hover:to-sky-600 transition-all hover:scale-[1.02]">
                                                            {__('Continue to Checkout')} <ArrowRight className="ml-2" size={20} />
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <a href="/checkout" onClick={() => setCartOpen(false)} className="block">
                                                        <Button className="w-full flex items-center justify-center h-14 rounded-full bg-gradient-to-r from-sky-500 to-sky-700 text-lg font-semibold text-white shadow-xl shadow-sky-900/20 hover:from-sky-400 hover:to-sky-600 transition-all hover:scale-[1.02]">
                                                            {__('Continue to Checkout')} <ArrowRight className="ml-2" size={20} />
                                                        </Button>
                                                    </a>
                                                )}
                                                <div className="mt-4 flex justify-center text-center text-sm text-muted-foreground">
                                                    <p>
                                                        {__('or')}{' '}
                                                        <button
                                                            type="button"
                                                            className="font-medium text-sky-600 hover:text-sky-500"
                                                            onClick={() => setCartOpen(false)}
                                                        >
                                                            {__('Continue Shopping')}<span aria-hidden="true"> &rarr;</span>
                                                        </button>
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}

