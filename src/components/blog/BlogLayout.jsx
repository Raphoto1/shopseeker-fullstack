"use client";

import Image from "next/image";
import Link from "next/link";
import UseSWR from "swr";

const fetcher = async (...args) => {
  const response = await fetch(...args);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
};

const categories = ["All", "Design", "Process", "Growth", "Toolkit", "Development"];

const getLinkedDesigns = (post) => {
  if (!post?.showLinkedDesign) return [];
  if (!Array.isArray(post?.linkedDesignIds)) return [];
  return post.linkedDesignIds.filter((item) => item && typeof item === "object" && item._id);
};

export default function BlogLayout() {
  const { data, error, isLoading } = UseSWR("/api/blog?limit=12&sortField=createdAt&sortQ=-1&published=true", fetcher);
  const livePosts = data?.payload?.docs || [];
  const postsToRender = livePosts;
  const featuredPost = postsToRender[0];
  const latestPosts = postsToRender.slice(1);
  const formatPostDate = (post) => post?.date || new Date(post?.publishedAt || post?.createdAt || Date.now()).toLocaleDateString();
  const featuredLinkedDesigns = getLinkedDesigns(featuredPost);

  if (isLoading && postsToRender.length === 0) {
    return (
      <main className='min-h-screen bg-[linear-gradient(135deg,#0b1324_0%,#13213f_45%,#0e172d_100%)] px-5 py-14 text-slate-100 sm:px-10 lg:px-16'>
        <div className='mx-auto flex max-w-6xl items-center justify-center py-20'>
          <span className='loading loading-infinity loading-lg' />
        </div>
      </main>
    );
  }

  if (!featuredPost) {
    return (
      <main className='min-h-screen bg-[linear-gradient(135deg,#0b1324_0%,#13213f_45%,#0e172d_100%)] px-5 py-14 text-slate-100 sm:px-10 lg:px-16'>
        <div className='mx-auto max-w-6xl rounded-2xl border border-white/10 bg-slate-900/50 p-8'>
          <h2 className='text-2xl font-bold'>aun no se ha publicado nada</h2>
        </div>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-[linear-gradient(135deg,#0b1324_0%,#13213f_45%,#0e172d_100%)] px-5 py-14 text-slate-100 sm:px-10 lg:px-16'>
      <div className='mx-auto w-full max-w-6xl'>
        <section className='rounded-3xl border border-cyan-200/20 bg-slate-900/45 p-7 shadow-[0_24px_70px_rgba(3,7,18,0.45)] backdrop-blur md:p-10'>
          <p className='inline-flex rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200'>
            Creative Rafa Blog
          </p>

          <h1 className='mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-5xl'>
            Notes on design, creative strategy, and full-stack execution
          </h1>

          <p className='mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg'>
            A curated space for practical breakdowns, experiments, and lessons learned while building creative products.
          </p>

          <div className='mt-8 flex flex-wrap gap-2'>
            {categories.map((category) => (
              <button
                key={category}
                type='button'
                className='rounded-full border border-slate-400/40 bg-slate-800/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 transition hover:border-cyan-300/60 hover:text-cyan-200'
              >
                {category}
              </button>
            ))}
          </div>

          {error && <p className='mt-4 text-xs text-amber-200'>No se pudieron cargar los posts publicados.</p>}
        </section>

        <section className='mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]'>
          <article className='group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/55 p-7 transition hover:border-cyan-300/40 md:p-8'>
            <div className='absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-300 via-emerald-300 to-orange-300' />

            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200'>
              Featured
            </p>

            <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl'>
              {featuredPost.title}
            </h2>

            <p className='mt-4 max-w-2xl text-slate-300'>{featuredPost.excerpt}</p>

            {featuredLinkedDesigns.length > 0 && (
              <div className='mt-5 space-y-2'>
                <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-200'>Linked Designs</p>
                <div className='grid gap-2 sm:grid-cols-2'>
                  {featuredLinkedDesigns.slice(0, 4).map((linkedDesign) => (
                    <Link
                      key={String(linkedDesign._id)}
                      href={`/shops/${linkedDesign._id}`}
                      className='block overflow-hidden rounded-2xl border border-cyan-200/25 bg-slate-950/45 p-3 transition hover:border-cyan-200/45'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='relative h-14 w-14 overflow-hidden rounded-lg border border-white/10'>
                          <Image
                            src={linkedDesign.photo || featuredPost.cover}
                            alt={linkedDesign.title || "Linked design"}
                            fill
                            sizes='56px'
                            className='object-cover'
                          />
                        </div>
                        <div className='min-w-0'>
                          <p className='truncate text-sm font-semibold text-slate-100'>{linkedDesign.title || "View design"}</p>
                          <p className='text-xs uppercase tracking-[0.12em] text-slate-400'>{linkedDesign.category || "Design"}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className='mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-slate-400'>
              <span>{featuredPost.category}</span>
              <span className='h-1 w-1 rounded-full bg-slate-500' />
              <span>{featuredPost.readTime}</span>
              <span className='h-1 w-1 rounded-full bg-slate-500' />
              <span>{formatPostDate(featuredPost)}</span>
            </div>

            <Link
              href={`/blog/${featuredPost.slug}`}
              className='mt-7 inline-flex items-center rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-900 transition group-hover:translate-x-1'
            >
              Read featured article
            </Link>
          </article>

          <aside className='rounded-3xl border border-white/10 bg-slate-900/55 p-6 md:p-7'>
            <h3 className='text-lg font-semibold'>Trending Topics</h3>
            <ul className='mt-4 space-y-3 text-sm text-slate-300'>
              <li className='rounded-xl border border-slate-700/70 bg-slate-800/50 px-3 py-2'>Design pipelines</li>
              <li className='rounded-xl border border-slate-700/70 bg-slate-800/50 px-3 py-2'>Store platform strategy</li>
              <li className='rounded-xl border border-slate-700/70 bg-slate-800/50 px-3 py-2'>Content production systems</li>
              <li className='rounded-xl border border-slate-700/70 bg-slate-800/50 px-3 py-2'>Analytics for creators</li>
            </ul>

            <div className='mt-6 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-4'>
              <p className='text-sm font-semibold text-cyan-100'>Stay in the loop</p>
              <p className='mt-2 text-sm text-slate-300'>
                New writing drops on process, design systems, and experiments from the workshop.
              </p>
            </div>
          </aside>
        </section>

        <section className='mt-8 grid gap-4 sm:grid-cols-2'>
          {latestPosts.map((post) => (
            (() => {
              const linkedDesigns = getLinkedDesigns(post);
              return (
            <article
              key={post.slug}
              id={post.slug}
              className='rounded-2xl border border-white/10 bg-slate-900/45 p-6 transition hover:border-emerald-300/40'
            >
              <div className='flex items-center justify-between gap-3 text-xs uppercase tracking-[0.14em] text-slate-400'>
                <span>{post.category}</span>
                <span>{formatPostDate(post)}</span>
              </div>

              <h3 className='mt-3 text-xl font-bold leading-snug'>{post.title}</h3>
              <p className='mt-3 text-sm text-slate-300'>{post.excerpt}</p>

              {linkedDesigns.length > 0 && (
                <div className='mt-4 space-y-2'>
                  {linkedDesigns.slice(0, 2).map((linkedDesign) => (
                    <Link
                      key={String(linkedDesign._id)}
                      href={`/shops/${linkedDesign._id}`}
                      className='block overflow-hidden rounded-xl border border-cyan-300/25 bg-slate-950/45 p-2 transition hover:border-cyan-300/45'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='relative h-12 w-12 overflow-hidden rounded-md border border-white/10'>
                          <Image
                            src={linkedDesign.photo || post.cover}
                            alt={linkedDesign.title || "Linked design"}
                            fill
                            sizes='48px'
                            className='object-cover'
                            loading='lazy'
                          />
                        </div>
                        <div className='min-w-0'>
                          <p className='truncate text-sm font-semibold text-slate-100'>{linkedDesign.title || "View design"}</p>
                          <p className='text-[11px] uppercase tracking-[0.12em] text-slate-400'>{linkedDesign.category || "Design"}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className='mt-5 flex items-center justify-between'>
                <span className='text-xs uppercase tracking-[0.14em] text-slate-400'>{post.readTime}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className='text-sm font-semibold text-cyan-200 transition hover:text-cyan-100'
                >
                  Read more
                </Link>
              </div>
            </article>
              );
            })()
          ))}
        </section>
      </div>
    </main>
  );
}
