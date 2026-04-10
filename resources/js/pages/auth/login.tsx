import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Mail, ArrowRight, Sparkles } from 'lucide-react';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <>
            <Head title="Log in" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="group relative grid gap-2">
                                <Label htmlFor="email" className="flex items-center gap-2 text-white/80 group-focus-within:text-amber-400 transition-colors">
                                    <Mail size={16} className="text-white/40 group-focus-within:text-amber-400 transition-colors" />
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="Enter your email address"
                                    className="h-12 border-white/10 bg-white/5 px-4 text-white placeholder:text-white/20 focus:border-amber-500/50 focus:ring-amber-500/50 rounded-xl transition-all"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="group relative grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password" className="flex items-center gap-2 text-white/80 group-focus-within:text-amber-400 transition-colors">
                                        <Sparkles size={16} className="text-white/40 group-focus-within:text-amber-400 transition-colors" />
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-xs font-medium text-amber-500 hover:text-amber-400 transition-colors"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    className="h-12 border-white/10 bg-white/5 px-4 text-white placeholder:text-white/20 focus:border-amber-500/50 focus:ring-amber-500/50 rounded-xl transition-all"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3 pt-2">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="border-white/20 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                                />
                                <Label htmlFor="remember" className="font-normal text-white/70 cursor-pointer hover:text-white transition-colors">
                                    Keep me signed in
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 h-12 w-full rounded-full bg-gradient-to-r from-amber-500 to-amber-700 font-semibold text-white shadow-xl shadow-amber-900/20 hover:scale-[1.02] hover:from-amber-400 hover:to-amber-600 transition-all duration-300 group/btn"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing ? (
                                    <Spinner className="mr-2" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover/btn:translate-x-1 group-hover/btn:opacity-100 transition-all" />
                                    </>
                                )}
                            </Button>

                            <div className="relative mt-4 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="bg-[#101010] px-2 text-white/40">Atau lanjutkan dengan</span>
                                </div>
                            </div>
                            
                            <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300">
                                <a 
                                    href="/auth/google"
                                    className="flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.02] py-4 text-sm font-semibold text-white transition-all hover:bg-white/[0.06] hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)] focus:outline-none focus:ring-2 focus:ring-white/20 sm:text-base cursor-pointer"
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
                                    Selalu Masuk dengan Google
                                </a>
                                <Button 
                                    variant="outline"
                                    type="button" 
                                    className="flex-1 h-11 border-white/10 bg-white/5 text-white shadow-sm hover:bg-white/10 hover:text-white"
                                >
                                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 170 170">
                                        <path d="M106.84 41.34c3.55-4.29 5.95-10.25 5.3-16.14-5.06.21-11.23 3.37-14.94 7.64-3 3.42-5.83 9.53-5.04 15.3 5.68.44 11.13-2.51 14.68-6.8zM111.45 44.57c-6.83.15-13.3 4.38-16.85 4.38-3.55 0-9.06-3.88-14.73-3.77-7.46.12-14.36 4.35-18.17 10.98-7.72 13.38-1.97 33.2 5.56 44.1 3.68 5.33 8.01 11.25 13.84 11.04 5.53-.21 7.6-3.57 14.3-3.57 6.64 0 8.56 3.57 14.4 3.46 6.04-.1 9.77-5.46 13.36-10.8 4.14-6.04 5.84-11.91 5.95-12.21-.13-.06-11.44-4.38-11.56-17.51-.12-10.99 8.98-16.27 9.4-16.54-5.18-7.55-13.25-8.38-15.5-8.56z"/>
                                    </svg>
                                    Apple
                                </Button>
                            </div>
                        </div>

                        {canRegister && (
                            <div className="mt-6 text-center text-sm text-white/50 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300 fill-mode-both">
                                Don't have an account?{' '}
                                <TextLink href={register()} tabIndex={5} className="font-semibold text-amber-500 hover:text-amber-400">
                                    Create one now
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center text-sm font-medium text-emerald-400 backdrop-blur-md">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Welcome Back',
    description: 'Enter your credentials to access your account',
};
