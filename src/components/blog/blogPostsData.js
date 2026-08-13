export const blogPostsData = [
  {
    slug: "design-systems",
    title: "Design systems that ship faster and feel coherent",
    excerpt: "How to organize UI decisions so visual quality stays high while iteration gets faster.",
    category: "Design",
    readTime: "8 min read",
    date: "Jul 2026",
    author: "Rafael Martinez",
    cover:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1600&q=80",
    content: [
      "A design system is less about documentation and more about decision speed. The goal is to reduce repeated discussion on basics and move more energy into product quality.",
      "Start with foundations that influence every screen: spacing rhythm, type scale, color tokens, and interaction states. If these are consistent, most UI decisions become simpler.",
      "Once foundations are stable, build components with clear usage boundaries. Teams move faster when a component says both what to do and what not to do.",
      "The final layer is governance. Lightweight review rituals and changelogs keep the system useful instead of becoming a static style guide."
    ]
  },
  {
    slug: "creative-workflows",
    title: "From concept to launch: a creative workflow blueprint",
    excerpt: "A practical framework to move from rough ideas to polished outputs without burning momentum.",
    category: "Process",
    readTime: "6 min read",
    date: "Jun 2026",
    author: "Rafael Martinez",
    cover:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
    content: [
      "Creative work breaks when there is no clear transition between idea, production, and publishing. A workflow blueprint solves that by defining handoff points.",
      "I use a three-step loop: explore, produce, publish. Each step has a small checklist and a clear done definition.",
      "The biggest gain comes from removing friction between steps. Templates, naming rules, and reusable blocks keep context switching low.",
      "What matters most is consistency. A simple process repeated every week outperforms a perfect system used only occasionally."
    ]
  },
  {
    slug: "shop-analytics",
    title: "Using analytics to understand what designs convert",
    excerpt: "Which signals actually matter when comparing platforms, audiences, and product styles.",
    category: "Growth",
    readTime: "7 min read",
    date: "May 2026",
    author: "Rafael Martinez",
    cover:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
    content: [
      "Metrics only help when they answer a decision. For creative shops, the decision is usually where to invest design time next.",
      "Track actions that represent intent: store clicks, design detail views, and repeat visits. Vanity impressions are not enough.",
      "Segment by platform and design category. A style that performs on one marketplace can underperform on another.",
      "Use a monthly review rhythm and keep a short action list. Analytics should lead to experiments, not just dashboards."
    ]
  },
  {
    slug: "creator-stack",
    title: "The creator stack: tools I rely on every week",
    excerpt: "A transparent look at the software and systems behind design, code, and content production.",
    category: "Toolkit",
    readTime: "5 min read",
    date: "Apr 2026",
    author: "Rafael Martinez",
    cover:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    content: [
      "A reliable creator stack is a set of tools that fit your process, not a list of trendy apps.",
      "I split the stack into four zones: planning, design, development, and analytics. Each zone has one primary tool and one backup.",
      "The key is interoperability. File naming, folder structure, and export rules matter as much as the tools themselves.",
      "Review your stack every quarter. Keep what still saves time and remove what introduces friction."
    ]
  }
];

export function getBlogPostBySlug(slug) {
  return blogPostsData.find((post) => post.slug === slug);
}
