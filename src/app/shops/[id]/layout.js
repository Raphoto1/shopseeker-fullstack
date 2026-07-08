import Page from "./page";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || "https://creativerafa.com";
  const designApiUrl = new URL(`/api/design/${id}`, siteUrl).toString();
  const designPageUrl = new URL(`/shops/${id}`, siteUrl).toString();

  let design = null;

  try {
    const response = await fetch(designApiUrl, { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      design = data?.payload || null;
    }
  } catch {
    // Fallback metadata is returned below when fetching design details fails.
  }

  if (!design) {
    return {
      title: "Design | Creative Rafa",
      description: "Explore this design on Creative Rafa.",
      alternates: {
        canonical: `/shops/${id}`,
      },
      openGraph: {
        url: designPageUrl,
        title: "Design | Creative Rafa",
        description: "Explore this design on Creative Rafa.",
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: "Design | Creative Rafa",
        description: "Explore this design on Creative Rafa.",
      },
    };
  }

  return {
    title: `${design.title} | Creative Rafa`,
    description: design.description,
    alternates: {
      canonical: `/shops/${id}`,
    },
    openGraph: {
      url: designPageUrl,
      title: design.title,
      description: design.description,
      type: "article",
      images: [{ url: design.photo, alt: design.title }],
    },
    twitter: {
      card: "summary_large_image",
      url: designPageUrl,
      title: design.title,
      description: design.description,
      images: [design.photo],
    },
  };
}
export default Page;
