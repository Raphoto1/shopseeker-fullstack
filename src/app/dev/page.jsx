import React from "react";
import Link from "next/link";

export default function DevPage() {
  return (
    <main className="relative isolate min-h-[80vh] overflow-hidden bg-base-100 px-6 py-16 text-base-content sm:px-10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-8 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <section className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
          In progress
        </span>

        <h1 className="text-balance text-4xl font-black leading-tight sm:text-6xl">
          This page is
          <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            under development
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-base text-base-content/70 sm:text-lg">
          This section is currently in progress.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/allshops"
            className="rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-bold text-primary-content transition hover:scale-105"
          >
            Support me by buying in my shops
          </Link>
        </div>
      </section>
    </main>
  );
}
