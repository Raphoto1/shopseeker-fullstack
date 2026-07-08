//imports propios
import Link from "next/link";
import ContactForm from "../contact/ContactForm";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className='mt-20 border-t border-slate-200 bg-slate-950 text-slate-100'>
      <div className='mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 py-12 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr] lg:py-16'>
        <aside>
          <p className='inline-flex rounded-full border border-sky-300/25 bg-slate-900/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200'>
            Creative Rafa
          </p>

          <h3 className='mt-5 max-w-md text-2xl font-semibold leading-tight text-white sm:text-3xl'>
            Design, development and digital craft in one place.
          </h3>

          <p className='mt-4 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base'>
            ShopSeeker helps you explore creative work and connect with the project ecosystem behind every design.
          </p>

          <div className='mt-6'>
            <ContactForm />
          </div>
        </aside>

        <nav aria-label='Footer navigation'>
          <h4 className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-300'>Explore</h4>
          <ul className='mt-4 space-y-3 text-sm'>
            <li>
              <Link href='/allshops' className='text-slate-100 transition-colors hover:text-sky-300'>
                All Shops
              </Link>
            </li>
            <li>
              <Link href='/about' className='text-slate-100 transition-colors hover:text-sky-300'>
                About
              </Link>
            </li>
            <li>
              <Link href='/blog' className='text-slate-100 transition-colors hover:text-sky-300'>
                Blog
              </Link>
            </li>
            <li>
              <Link href='/dev' className='text-slate-100 transition-colors hover:text-sky-300'>
                Dev Space
              </Link>
            </li>
          </ul>
        </nav>

        <section>
          <h4 className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-300'>Contact</h4>
          <div className='mt-4 space-y-3 text-sm text-slate-200'>
            <p>
              Open to collaborations, commissions and technical creative partnerships.
            </p>
            <a
              href='mailto:info@creativerafa.com'
              className='inline-flex items-center rounded-lg border border-slate-500/70 bg-slate-900/40 px-3 py-2 transition-colors hover:border-sky-300 hover:text-sky-200'
            >
              info@creativerafa.com
            </a>
          </div>
        </section>
      </div>

      <div className='border-t border-white/10 px-6 py-5 text-xs text-slate-300 sm:px-8'>
        <div className='mx-auto flex w-full max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <p>Rafael Martinez {year} - All rights reserved.</p>
          <p>Built with Next.js and Tailwind.</p>
        </div>
      </div>
    </footer>
  );
}
