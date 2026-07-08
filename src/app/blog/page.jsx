import BlogLayout from "@/components/blog/BlogLayout";

// 🚀 ISR: Regenerar esta página cada 60 segundos
export const revalidate = 60;

export default function Page() {
  return <BlogLayout />;
}
