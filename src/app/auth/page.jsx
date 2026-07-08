//imports propios
import Register from "@/components/user/Register";
import Login from "@/components/user/Login";
import Forgot from "@/components/user/Forgot";
export default function auth() {
    return (
        <main className='min-h-[calc(100vh-6rem)] bg-base-200 mt-4'>
            <section className='relative mx-auto flex w-full max-w-6xl flex-col px-4 py-12 sm:px-6 md:py-16'>
                <div className='mb-10 max-w-2xl'>
                    <p className='mb-3 inline-flex rounded-full border border-base-300 bg-base-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-primary'>
                        ShopSeeker Account Center
                    </p>
                    <h1 className='text-3xl font-black leading-tight text-base-content sm:text-4xl md:text-5xl'>
                        Join, access, or recover your account in one place
                    </h1>
                    <p className='mt-4 text-sm text-base-content/70 sm:text-base'>
                        Choose what you need to do and we will open the corresponding form. The flow is optimized for both mobile and desktop.
                    </p>
                </div>

                <div className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3'>
                    <article className='rounded-2xl border border-base-300 bg-base-100/80 p-6 shadow-xl backdrop-blur'>
                        <h2 className='text-xl font-bold text-base-content'>Create Account</h2>
                        <p className='mt-2 min-h-12 text-sm text-base-content/70'>
                            New here? Set up your profile as artist or fan and start discovering opportunities.
                        </p>
                        <div className='flex justify-center mt-5'>
                            <Register />
                        </div>
                    </article>

                    <article className='rounded-2xl border border-base-300 bg-base-100/80 p-6 shadow-xl backdrop-blur'>
                        <h2 className='text-xl font-bold text-base-content'>Sign In</h2>
                        <p className='mt-2 min-h-12 text-sm text-base-content/70'>
                            Access your dashboard and continue with your saved designs, favorites, and settings.
                        </p>
                        <div className='flex justify-center mt-5'>
                            <Login />
                        </div>
                    </article>

                    <article className='rounded-2xl border border-base-300 bg-base-100/80 p-6 shadow-xl backdrop-blur md:col-span-2 xl:col-span-1'>
                        <h2 className='text-xl font-bold text-base-content'>Forgot Password</h2>
                        <p className='mt-2 min-h-12 text-sm text-base-content/70'>
                            Recover account access quickly by requesting a secure password reset link.
                        </p>
                        <div className='flex justify-center mt-5'>
                            <Forgot />
                        </div>
                    </article>
                </div>
            </section>
        </main>
    );
}