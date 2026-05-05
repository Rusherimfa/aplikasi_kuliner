import { Dialog, Transition } from '@headlessui/react';
import { Link, usePage } from '@inertiajs/react';
import {
    X,
    Minus,
    Plus,
    ShoppingBag,
    ArrowRight,
    UtensilsCrossed,
} from 'lucide-react';
import { Fragment, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog as ConfirmDialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useCart } from '@/hooks/use-cart';
import { useTranslations } from '@/hooks/use-translations';

export default function CartDrawer() {
    const {
        isCartOpen,
        setCartOpen,
        items,
        removeItem,
        updateQuantity,
        updateNotes,
        cartTotal,
    } = useCart();
    const { auth, locale } = usePage().props as any;
    const { __ } = useTranslations();
    const [itemToRemove, setItemToRemove] = useState<
        (typeof items)[number] | null
    >(null);

    const formatCurrency = (amount: number) => {
        return amount
            .toLocaleString(locale === 'id' ? 'id-ID' : 'en-US', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            })
            .replace('IDR', 'Rp');
    };

    const confirmRemoveItem = () => {
        if (!itemToRemove) {
            return;
        }

        removeItem(itemToRemove.id);
        setItemToRemove(null);
    };

    const handleDecreaseQuantity = (item: (typeof items)[number]) => {
        if (item.quantity <= 1) {
            setItemToRemove(item);

            return;
        }

        updateQuantity(item.id, item.quantity - 1);
    };

    return (
        <>
            <Transition.Root show={isCartOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={setCartOpen}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" />
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
                                                    <Dialog.Title className="flex items-center gap-2 font-['Playfair_Display',serif] text-xl font-bold text-foreground">
                                                        <ShoppingBag
                                                            size={24}
                                                            className="text-sky-500"
                                                        />
                                                        {__('Your Selection')}
                                                    </Dialog.Title>
                                                    <div className="ml-3 flex h-7 items-center">
                                                        <button
                                                            type="button"
                                                            className="relative -m-2 p-2 text-muted-foreground transition-colors hover:text-foreground"
                                                            onClick={() =>
                                                                setCartOpen(
                                                                    false,
                                                                )
                                                            }
                                                        >
                                                            <span className="absolute -inset-0.5" />
                                                            <span className="sr-only">
                                                                Close panel
                                                            </span>
                                                            <X
                                                                className="h-6 w-6"
                                                                aria-hidden="true"
                                                            />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mt-8">
                                                    {items.length === 0 ? (
                                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                                            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                                                                <UtensilsCrossed
                                                                    size={40}
                                                                    className="text-muted-foreground/40"
                                                                />
                                                            </div>
                                                            <h3 className="mb-2 text-lg font-medium text-foreground">
                                                                {__(
                                                                    'Empty Cart',
                                                                )}
                                                            </h3>
                                                            <p className="max-w-[200px] text-muted-foreground">
                                                                {__(
                                                                    'Please browse our catalog to add gourmet dishes.',
                                                                )}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="flow-root">
                                                            <ul
                                                                role="list"
                                                                className="-my-6 divide-y divide-border"
                                                            >
                                                                {items.map(
                                                                    (item) => (
                                                                        <li
                                                                            key={
                                                                                item.id
                                                                            }
                                                                            className="flex py-6"
                                                                        >
                                                                            <div className="flex flex-1 flex-col">
                                                                                <div>
                                                                                    <div className="flex justify-between text-base font-semibold text-foreground">
                                                                                        <h4 className="line-clamp-2 pr-4">
                                                                                            {
                                                                                                item.name
                                                                                            }
                                                                                        </h4>
                                                                                        <p className="ml-4 whitespace-nowrap text-sky-600">
                                                                                            {formatCurrency(
                                                                                                Number(
                                                                                                    item.price,
                                                                                                ) *
                                                                                                    item.quantity,
                                                                                            )}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="mt-4 flex flex-1 items-end justify-between text-sm">
                                                                                    <div className="mr-4 flex flex-1 flex-col gap-3">
                                                                                        <div className="flex w-fit items-center gap-3 rounded-full border border-border bg-background p-1 shadow-sm">
                                                                                            <button
                                                                                                onClick={() =>
                                                                                                    handleDecreaseQuantity(
                                                                                                        item,
                                                                                                    )
                                                                                                }
                                                                                                className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
                                                                                            >
                                                                                                <Minus
                                                                                                    size={
                                                                                                        14
                                                                                                    }
                                                                                                />
                                                                                            </button>
                                                                                            <span className="w-4 text-center font-medium text-foreground">
                                                                                                {
                                                                                                    item.quantity
                                                                                                }
                                                                                            </span>
                                                                                            <button
                                                                                                onClick={() =>
                                                                                                    updateQuantity(
                                                                                                        item.id,
                                                                                                        item.quantity +
                                                                                                            1,
                                                                                                    )
                                                                                                }
                                                                                                className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 hover:bg-sky-500/20"
                                                                                            >
                                                                                                <Plus
                                                                                                    size={
                                                                                                        14
                                                                                                    }
                                                                                                />
                                                                                            </button>
                                                                                        </div>

                                                                                        <textarea
                                                                                            placeholder={__(
                                                                                                'Add notes (e.g., no spicy)...',
                                                                                            )}
                                                                                            value={
                                                                                                item.notes ||
                                                                                                ''
                                                                                            }
                                                                                            onChange={(
                                                                                                e,
                                                                                            ) =>
                                                                                                updateNotes(
                                                                                                    item.id,
                                                                                                    e
                                                                                                        .target
                                                                                                        .value,
                                                                                                )
                                                                                            }
                                                                                            className="h-12 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-2 text-[10px] text-foreground focus:ring-1 focus:ring-sky-500/30 focus:outline-none dark:border-white/10 dark:bg-white/5"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                    ),
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {items.length > 0 && (
                                                <div className="border-t border-border bg-card px-4 py-6 sm:px-6">
                                                    <div className="mb-6 flex justify-between text-lg font-bold text-foreground">
                                                        <p>
                                                            {__('Order Total')}
                                                        </p>
                                                        <p className="text-sky-600">
                                                            {formatCurrency(
                                                                cartTotal,
                                                            )}
                                                        </p>
                                                    </div>
                                                    {auth?.user ? (
                                                        <Link
                                                            href="/checkout"
                                                            onClick={() =>
                                                                setCartOpen(
                                                                    false,
                                                                )
                                                            }
                                                        >
                                                            <Button className="flex h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-sky-700 text-lg font-semibold text-white shadow-xl shadow-sky-900/20 transition-all hover:scale-[1.02] hover:from-sky-400 hover:to-sky-600">
                                                                {__(
                                                                    'Continue to Checkout',
                                                                )}{' '}
                                                                <ArrowRight
                                                                    className="ml-2"
                                                                    size={20}
                                                                />
                                                            </Button>
                                                        </Link>
                                                    ) : (
                                                        <a
                                                            href="/checkout"
                                                            onClick={() =>
                                                                setCartOpen(
                                                                    false,
                                                                )
                                                            }
                                                            className="block"
                                                        >
                                                            <Button className="flex h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-sky-700 text-lg font-semibold text-white shadow-xl shadow-sky-900/20 transition-all hover:scale-[1.02] hover:from-sky-400 hover:to-sky-600">
                                                                {__(
                                                                    'Continue to Checkout',
                                                                )}{' '}
                                                                <ArrowRight
                                                                    className="ml-2"
                                                                    size={20}
                                                                />
                                                            </Button>
                                                        </a>
                                                    )}
                                                    <div className="mt-4 flex justify-center text-center text-sm text-muted-foreground">
                                                        <p>
                                                            {__('or')}{' '}
                                                            <button
                                                                type="button"
                                                                className="font-medium text-sky-600 hover:text-sky-500"
                                                                onClick={() =>
                                                                    setCartOpen(
                                                                        false,
                                                                    )
                                                                }
                                                            >
                                                                {__(
                                                                    'Continue Shopping',
                                                                )}
                                                                <span aria-hidden="true">
                                                                    {' '}
                                                                    &rarr;
                                                                </span>
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

            <ConfirmDialog
                open={!!itemToRemove}
                onOpenChange={(open) => {
                    if (!open) {
                        setItemToRemove(null);
                    }
                }}
            >
                <DialogContent
                    overlayClassName="z-[70] bg-black/85"
                    className="z-[71] sm:max-w-md"
                >
                    <DialogHeader>
                        <DialogTitle>{__('Remove this dish?')}</DialogTitle>
                        <DialogDescription>
                            {__(
                                'Please confirm that you really want to remove this item from your cart.',
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    {itemToRemove && (
                        <div className="rounded-lg border bg-muted/40 p-3">
                            <p className="font-medium text-foreground">
                                {itemToRemove.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {itemToRemove.quantity} x{' '}
                                {formatCurrency(Number(itemToRemove.price))}
                            </p>
                        </div>
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">{__('Cancel')}</Button>
                        </DialogClose>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={confirmRemoveItem}
                        >
                            {__('Remove')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </ConfirmDialog>
        </>
    );
}
