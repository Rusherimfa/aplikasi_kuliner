import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Minus, Plus, ShoppingBag, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export default function CartDrawer() {
    const { isCartOpen, setCartOpen, items, removeItem, updateQuantity, cartTotal } = useCart();

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
                                    <div className="flex h-full flex-col bg-[#FAFAFA] shadow-2xl">
                                        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-xl font-['Playfair_Display',serif] font-bold text-slate-900 flex items-center gap-2">
                                                    <ShoppingBag size={24} className="text-amber-500" />
                                                    Pesanan Anda
                                                </Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="relative -m-2 p-2 text-slate-400 hover:text-slate-500 transition-colors"
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
                                                        <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                                                            <UtensilsCrossed size={40} className="text-slate-300" />
                                                        </div>
                                                        <h3 className="text-lg font-medium text-slate-900 mb-2">Keranjang Kosong</h3>
                                                        <p className="text-slate-500 max-w-[200px]">
                                                            Silakan telusuri katalog untuk menambahkan hidangan.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="flow-root">
                                                        <ul role="list" className="-my-6 divide-y divide-slate-200">
                                                            {items.map((item) => (
                                                                <li key={item.id} className="flex py-6">
                                                                    <div className="flex flex-1 flex-col">
                                                                        <div>
                                                                            <div className="flex justify-between text-base font-semibold text-slate-900">
                                                                                <h4 className="line-clamp-2 pr-4">{item.name}</h4>
                                                                                <p className="ml-4 whitespace-nowrap text-amber-600">
                                                                                    Rp {(Number(item.price) * item.quantity).toLocaleString('id-ID')}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-1 items-end justify-between text-sm mt-4">
                                                                            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
                                                                                <button
                                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                                    className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                                                >
                                                                                    <Minus size={14} />
                                                                                </button>
                                                                                <span className="w-4 text-center font-medium text-slate-900">{item.quantity}</span>
                                                                                <button
                                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                                    className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700"
                                                                                >
                                                                                    <Plus size={14} />
                                                                                </button>
                                                                            </div>

                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removeItem(item.id)}
                                                                                className="font-medium text-red-500 hover:text-red-700 transition-colors"
                                                                            >
                                                                                Hapus
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
                                            <div className="border-t border-slate-200 bg-white px-4 py-6 sm:px-6">
                                                <div className="flex justify-between text-lg font-bold text-slate-900 mb-6">
                                                    <p>Total Pesanan</p>
                                                    <p className="text-amber-600">Rp {cartTotal.toLocaleString('id-ID')}</p>
                                                </div>
                                                <Link href="/checkout" onClick={() => setCartOpen(false)}>
                                                    <Button className="w-full flex items-center justify-center h-14 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 text-lg font-semibold text-white shadow-xl shadow-amber-900/20 hover:from-amber-400 hover:to-amber-600 transition-all hover:scale-[1.02]">
                                                        Lanjut ke Pembayaran <ArrowRight className="ml-2" size={20} />
                                                    </Button>
                                                </Link>
                                                <div className="mt-4 flex justify-center text-center text-sm text-slate-500">
                                                    <p>
                                                        atau{' '}
                                                        <button
                                                            type="button"
                                                            className="font-medium text-amber-600 hover:text-amber-500"
                                                            onClick={() => setCartOpen(false)}
                                                        >
                                                            Lanjut Belanja<span aria-hidden="true"> &rarr;</span>
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
