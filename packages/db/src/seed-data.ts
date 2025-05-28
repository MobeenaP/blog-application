export const posts = [
  {
    title: "Getting Started with Next.js",
    content: "Next.js is a powerful React framework...",
    category: "Programming",
    description: "Learn the basics of Next.js and how to get started with your first project.",
    imageUrl: "https://example.com/nextjs.jpg",
    tags: "nextjs,react,javascript",
    urlId: "getting-started-nextjs",
    active: true,
    date: new Date("2024-01-01"),
    views: 100,
    likes: 10
  },
  {
    title: "Understanding TypeScript",
    content: "TypeScript adds static typing to JavaScript...",
    category: "Programming",
    description: "Explore the benefits of TypeScript and how it improves your JavaScript development.",
    imageUrl: "https://example.com/typescript.jpg",
    tags: "typescript,javascript,programming",
    urlId: "understanding-typescript",
    active: true,
    date: new Date("2024-01-02"),
    views: 80,
    likes: 8
  },
  {
    title: "Boost your conversion rate",
    content: "# Boost your conversion rate\n\nLorem ipsum dolor sit amet **sint voluptas** consectetur adipisicing elit. Architecto accusantium praesentium eius, ut atque fuga culpa, similique sequi cum eos quis dolorum.",
    description: "How to boost your conversion rate with our new tool",
    imageUrl: "https://images.unsplash.com/photo-1496128858413-b36217c2ce36",
    category: "Marketing",
    views: 320,
    likes: 3,
    tags: "marketing,conversion,business",
    urlId: "boost-your-conversion-rate",
    active: true,
    date: new Date("2024-01-03")
  },
  ...Array.from({ length: 15 }, (_, i) => ({
    title: `Sample Post ${i + 4}`,
    content: `This is the content for sample post ${i + 4}...`,
    category: "General",
    description: `Description for sample post ${i + 4}`,
    imageUrl: `https://example.com/image${i + 4}.jpg`,
    tags: "sample,test",
    urlId: `sample-post-${i + 4}`,
    active: true,
    date: new Date(2024, 0, i + 4),
    views: Math.floor(Math.random() * 100),
    likes: Math.floor(Math.random() * 10)
  }))
]; 