import React from 'react'
import Link from 'next/link'
import UseSWR from "swr"

const fetcher = async (...args) => {
  const response = await fetch(...args);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
}

export default function HomePreviewBlog() {
  const { data, error, isLoading } = UseSWR("/api/blog?limit=4&sortField=createdAt&sortQ=-1&published=true", fetcher);
  
  const posts = data?.payload?.docs || [];

  if (isLoading) {
    return (
      <div className='mt-12'>
        <h2 className='mb-8 text-3xl font-bold text-center'>Latest from the Blog</h2>
        <div className='grid gap-6 lg:grid-cols-2'>
          <div className='col-span-2 flex justify-center py-10'>
            <span className='loading loading-infinity loading-lg' />
          </div>
        </div>
      </div>
    )
  }

  if (error || posts.length === 0) {
    return (
      <div className='mt-12'>
        <h2 className='mb-8 text-3xl font-bold text-center'>Latest from the Blog</h2>
        <p className='text-base-content/50'>No posts found or there was an error loading them.</p>
      </div>
    )
  }

  return (
    <div className='mt-12'>
      <h2 className='mb-8 text-3xl font-bold text-center'>Latest from the Blog</h2>
      <section className='grid gap-6 lg:grid-cols-2'>
        {posts.map((post) => (
          <article key={post._id} className='group relative overflow-hidden rounded-3xl border border-base-300 bg-base-200/50 p-7 transition hover:border-primary/60 md:p-8'>
            <div className='absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent' />
            
            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-primary'>
              {post.category}
            </p>
            
            <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl'>
              {post.title}
            </h2>
            
            <p className='mt-4 max-w-2xl text-base-content/70'>{post.excerpt}</p>
            
            <div className='mt-6 flex items-center gap-4'>
              <Link 
                href={`/blog/${post.slug}`} 
                className='inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-content transition hover:bg-primary/90'
              >
                Read more
              </Link>
              <span className='text-xs text-base-content/50'>{post.readTime}</span>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
