import React from 'react';

export default function PageSkeleton() {
  return (
    <div className="px-4 animate-pulse">
      {/* Hero skeleton */}
      <div className="flex justify-center p-5">
        <div className="h-16 w-64 bg-gray-300 rounded-lg"></div>
      </div>
      
      {/* Flow skeleton */}
      <div className="flex w-full pt-5 space-x-4">
        <div className="flex-grow h-20 bg-gray-300 rounded-box"></div>
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
        <div className="flex-grow h-20 bg-gray-300 rounded-box"></div>
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
        <div className="flex-grow h-20 bg-gray-300 rounded-box"></div>
      </div>
      
      {/* Grid skeleton */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-square bg-gray-300 rounded-lg"></div>
            <div className="aspect-[3/4] bg-gray-300 rounded-lg"></div>
            <div className="aspect-square bg-gray-300 rounded-lg"></div>
          </div>
        ))}
      </section>
    </div>
  );
}