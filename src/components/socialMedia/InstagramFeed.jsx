import React, { useEffect, useState } from "react";

export default function InstagramFeed() {
  const instaPath = `/api/socialM`;

  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch(instaPath)
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.instaPosts);
      })
      .catch((error) => console.error("Error fetching Instagram posts:", error));
  }, []);
  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4 text-center'>Follow me on Instagram</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
        {posts.slice(0, 8).map((post) => (
          <div key={post.id} className='card shadow-lg'>
            <a href={post.permalink} target='_blank' rel='noopener noreferrer'>
              <figure>
                {post.media_type === "VIDEO" ? (
                  <video controls className='w-full h-auto' autoPlay loop muted>
                    <source src={post.media_url} type='video/mp4' />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img src={post.media_url} alt={post.caption} className='w-full h-auto' />
                )}
              </figure>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
