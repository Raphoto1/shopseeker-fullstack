import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogBySlug } from "@/service/blog.service";

export const revalidate = 60;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let post;
  try {
    post = await getBlogBySlug(slug);
  } catch (error) {
    if (error?.message !== "Blog not found") {
      throw error;
    }
    return {
      title: "Post not found | Creative Rafa",
      description: "The requested post could not be found.",
    };
  }

  return {
    title: `${post.title} | Creative Rafa`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: [{ url: post.cover, alt: post.title }],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  let post;
  try {
    post = await getBlogBySlug(slug);
  } catch (error) {
    if (error?.message === "Blog not found") {
      notFound();
    }
    throw error;
  }

  if (!post) {
    notFound();
  }

  const postDate = new Date(post.publishedAt || post.createdAt || Date.now()).toLocaleDateString();
  const htmlContent = post.contentHtml || "";
  const plainContent = post.contentText || "";
  const linkedDesigns = Array.isArray(post?.linkedDesignIds)
    ? post.linkedDesignIds.filter((item) => item && typeof item === "object" && item._id)
    : [];
  const hasLinkedDesign = Boolean(post?.showLinkedDesign) && linkedDesigns.length > 0;

  return (
    <main className='min-h-screen bg-[linear-gradient(160deg,#0b1324_0%,#101f3b_52%,#0a1427_100%)] px-5 py-14 text-slate-100 sm:px-10 lg:px-16'>
      <article className='mx-auto max-w-4xl'>
        <Link href='/blog' className='inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-cyan-100'>
          Back to Blog
        </Link>

        <header className='mt-6 rounded-3xl border border-cyan-200/20 bg-slate-900/50 p-7 shadow-[0_20px_60px_rgba(3,7,18,0.45)]'>
          <div className='flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.14em] text-slate-300'>
            <span className='rounded-full border border-slate-400/40 px-3 py-1'>{post.category}</span>
            <span>{postDate}</span>
            <span>{post.readTime}</span>
          </div>

          <h1 className='mt-4 text-3xl font-black leading-tight sm:text-5xl'>{post.title}</h1>
          <p className='mt-4 max-w-3xl text-slate-300 sm:text-lg'>{post.excerpt}</p>

          <p className='mt-5 text-sm text-slate-400'>By {post.author}</p>
        </header>

        <div className='mt-8 overflow-hidden rounded-3xl border border-white/10'>
          <Image
            src={post.cover}
            alt={post.title}
            width={1600}
            height={900}
            className='h-auto w-full object-cover'
            priority
          />
        </div>

        <section className='mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]'>
          <div className='rounded-3xl border border-white/10 bg-slate-900/45 p-7 md:p-10'>
            {htmlContent ? (
              <div
                className='prose prose-invert max-w-none text-base leading-relaxed'
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            ) : (
              <div className='space-y-6 text-base leading-relaxed text-slate-200 sm:text-lg'>
                {plainContent
                  .split("\n")
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={`${post.slug}-paragraph-${index}`}>{paragraph}</p>
                  ))}
              </div>
            )}
          </div>

          {hasLinkedDesign && (
            <aside className='h-fit rounded-3xl border border-cyan-300/30 bg-slate-900/55 p-4 lg:sticky lg:top-24'>
              <p className='text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200'>Linked Designs</p>
              <div className='mt-3 space-y-3'>
                {linkedDesigns.map((linkedDesign) => (
                  <Link key={String(linkedDesign._id)} href={`/shops/${linkedDesign._id}`} className='group block overflow-hidden rounded-2xl border border-white/10 bg-slate-950/45'>
                    <div className='relative aspect-[4/3] overflow-hidden'>
                      <Image
                        src={linkedDesign.photo || post.cover}
                        alt={linkedDesign.title || "Linked design"}
                        fill
                        sizes='(min-width: 1024px) 320px, 100vw'
                        className='object-cover transition duration-300 group-hover:scale-105'
                      />
                    </div>
                    <div className='p-4'>
                      <h3 className='line-clamp-2 text-sm font-bold text-slate-100'>{linkedDesign.title || "View linked design"}</h3>
                      <p className='mt-1 text-xs uppercase tracking-[0.12em] text-slate-400'>{linkedDesign.category || "Design"}</p>
                      <span className='mt-3 inline-flex items-center text-xs font-semibold text-cyan-200 transition group-hover:text-cyan-100'>View design</span>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </section>
      </article>
    </main>
  );
}
