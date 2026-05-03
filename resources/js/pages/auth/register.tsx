import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { User, Mail, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';

export default function Register() {
    const { __ } = useTranslations();
    return (
        <>
            <Head title={__('Register')} />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="group relative grid gap-2">
                                <Label htmlFor="name" className="flex items-center gap-2 text-muted-foreground group-focus-within:text-sky-500 transition-colors">
                                    <User size={16} className="text-muted-foreground/60 group-focus-within:text-sky-500 transition-colors" />
                                    {__('Full Name')}
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder={__('Enter your full name')}
                                    className="h-12 border-border bg-background/50 px-4 text-foreground placeholder:text-muted-foreground/30 focus:border-sky-500/50 focus:ring-sky-500/50 rounded-xl transition-all"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-1"
                                />
                            </div>

                            <div className="group relative grid gap-2">
                                <Label htmlFor="email" className="flex items-center gap-2 text-muted-foreground group-focus-within:text-sky-500 transition-colors">
                                    <Mail size={16} className="text-muted-foreground/60 group-focus-within:text-sky-500 transition-colors" />
                                    {__('Email address')}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                    className="h-12 border-border bg-background/50 px-4 text-foreground placeholder:text-muted-foreground/30 focus:border-sky-500/50 focus:ring-sky-500/50 rounded-xl transition-all"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="group relative grid gap-2">
                                <Label htmlFor="phone" className="flex items-center gap-2 text-muted-foreground group-focus-within:text-sky-500 transition-colors">
                                    <span className="text-muted-foreground/60 group-focus-within:text-sky-500 transition-colors">📱</span>
                                    {__('Nomor WhatsApp')}
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    required
                                    tabIndex={3}
                                    autoComplete="tel"
                                    name="phone"
                                    placeholder="08123456789"
                                    className="h-12 border-border bg-background/50 px-4 text-foreground placeholder:text-muted-foreground/30 focus:border-sky-500/50 focus:ring-sky-500/50 rounded-xl transition-all"
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="group relative grid gap-2">
                                <Label htmlFor="password" className="flex items-center gap-2 text-muted-foreground group-focus-within:text-sky-500 transition-colors">
                                    <Sparkles size={16} className="text-muted-foreground/60 group-focus-within:text-sky-500 transition-colors" />
                                    {__('Password')}
                                </Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder={__('Create a strong password')}
                                    className="h-12 border-border bg-background/50 px-4 text-foreground placeholder:text-muted-foreground/30 focus:border-sky-500/50 focus:ring-sky-500/50 rounded-xl transition-all"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="group relative grid gap-2">
                                <Label htmlFor="password_confirmation" className="flex items-center gap-2 text-muted-foreground group-focus-within:text-sky-500 transition-colors">
                                    <CheckCircle2 size={16} className="text-muted-foreground/60 group-focus-within:text-sky-500 transition-colors" />
                                    {__('Confirm password')}
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder={__('Confirm your password')}
                                    className="h-12 border-border bg-background/50 px-4 text-foreground placeholder:text-muted-foreground/30 focus:border-sky-500/50 focus:ring-sky-500/50 rounded-xl transition-all"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 h-12 w-full rounded-full bg-gradient-to-r from-sky-500 to-sky-700 font-semibold text-white shadow-xl shadow-sky-900/20 hover:scale-[1.02] hover:from-sky-400 hover:to-sky-600 transition-all duration-300 group/btn"
                                tabIndex={6}
                                data-test="register-user-button"
                            >
                                {processing ? (
                                    <Spinner className="mr-2" />
                                ) : (
                                    <>
                                        {__('Create Account')}
                                        <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover/btn:translate-x-1 group-hover/btn:opacity-100 transition-all" />
                                    </>
                                )}
                            </Button>
                            
                            <div className="relative mt-4 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="bg-background/80 px-2 text-muted-foreground/60 backdrop-blur-sm">{__('Atau lanjutkan dengan')}</span>
                                </div>
                            </div>
                            
                            <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300">
                                <a 
                                    href="/auth/google" 
                                    className="flex w-full items-center justify-center gap-3 rounded-full border border-border bg-background/50 py-4 text-sm font-semibold text-foreground transition-all hover:bg-background hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)] focus:outline-none focus:ring-2 focus:ring-sky-500/20 sm:text-base cursor-pointer"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    {__('Selalu Masuk dengan Google')}
                                </a>
                            </div>
                        </div>

                        <div className="mt-4 text-center text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300 fill-mode-both">
                            {__('Already have an account?')}{' '}
                            <TextLink href={login()} tabIndex={7} className="font-semibold text-sky-600 hover:text-sky-500">
                                {__('Sign In')}
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: "Join Ocean's Resto",
    description: 'Create your account to experience premium dining',
};

