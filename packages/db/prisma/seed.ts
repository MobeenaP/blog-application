import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const content = `
# Welcome to Our Blog!

This is a sample blog post demonstrating various Markdown features.

## Rich Text Features

You can write text in **bold** or *italic*. You can also create:

- Bullet points
- Like this
- And this

1. Numbered lists
2. Are also supported
3. Like this

### Code Examples

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

## Links and Images

You can [add links](https://example.com) and embed images!
`;

const blogPosts = [
  {
    title: "Getting Started with TypeScript",
    urlId: "getting-started-with-typescript",
    description: "Learn the basics of TypeScript and how it can improve your JavaScript development experience.",
    content: content + "\n\nTypeScript adds static typing to JavaScript, making your code more maintainable and catching errors early.",
    imageUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
    category: "TypeScript",
    tags: "TypeScript,JavaScript,Programming",
    views: 156,
    likes: 23,
  },
  {
    title: "Modern React Development",
    urlId: "modern-react-development",
    description: "Explore modern React development practices including hooks, context, and more.",
    content: content + "\n\nReact has evolved significantly with the introduction of hooks and modern patterns.",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    category: "React",
    tags: "React,JavaScript,Web Development",
    views: 234,
    likes: 45,
  },
  {
    title: "Building RESTful APIs with Node.js",
    urlId: "building-restful-apis-with-nodejs",
    description: "Learn how to create robust and scalable RESTful APIs using Node.js and Express.",
    content: content + "\n\nNode.js is a powerful platform for building server-side applications and APIs.",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    category: "Node.js",
    tags: "Node.js,API,Backend",
    views: 189,
    likes: 34,
  },
  {
    title: "CSS Grid Layout Mastery",
    urlId: "css-grid-layout-mastery",
    description: "Master CSS Grid Layout and create responsive web designs with ease.",
    content: content + "\n\nCSS Grid Layout provides a powerful system for creating complex web layouts.",
    imageUrl: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2",
    category: "CSS",
    tags: "CSS,Web Design,Frontend",
    views: 145,
    likes: 28,
  },
  {
    title: "Introduction to Docker",
    urlId: "introduction-to-docker",
    description: "Get started with Docker containerization for modern application deployment.",
    content: content + "\n\nDocker simplifies application deployment through containerization.",
    imageUrl: "https://images.unsplash.com/photo-1605745341112-85968b19335b",
    category: "DevOps",
    tags: "Docker,DevOps,Containers",
    views: 167,
    likes: 31,
  },
  {
    title: "Vue.js 3 Composition API",
    urlId: "vuejs-3-composition-api",
    description: "Learn how to use Vue.js 3 Composition API for better code organization.",
    content: content + "\n\nThe Composition API provides a more flexible way to organize component logic.",
    imageUrl: "https://images.unsplash.com/photo-1537884944318-390069bb8665",
    category: "Vue.js",
    tags: "Vue.js,JavaScript,Frontend",
    views: 178,
    likes: 39,
  },
  {
    title: "GraphQL Fundamentals",
    urlId: "graphql-fundamentals",
    description: "Understanding GraphQL basics and how it differs from REST APIs.",
    content: content + "\n\nGraphQL provides a more efficient way to query your API data.",
    imageUrl: "https://images.unsplash.com/photo-1555099962-4199c345e5dd",
    category: "GraphQL",
    tags: "GraphQL,API,Backend",
    views: 143,
    likes: 27,
  },
  {
    title: "Python for Data Science",
    urlId: "python-for-data-science",
    description: "Getting started with Python for data analysis and visualization.",
    content: content + "\n\nPython is a popular choice for data science due to its rich ecosystem.",
    imageUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935",
    category: "Python",
    tags: "Python,Data Science,Programming",
    views: 198,
    likes: 42,
  },
  {
    title: "Kubernetes for Beginners",
    urlId: "kubernetes-for-beginners",
    description: "Learn the basics of container orchestration with Kubernetes.",
    content: content + "\n\nKubernetes helps manage containerized applications at scale.",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692",
    category: "DevOps",
    tags: "Kubernetes,DevOps,Containers",
    views: 156,
    likes: 29,
  },
  {
    title: "Web Accessibility Guidelines",
    urlId: "web-accessibility-guidelines",
    description: "Understanding WCAG and implementing accessible web design.",
    content: content + "\n\nMaking your web applications accessible is crucial for inclusive design.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    category: "Accessibility",
    tags: "Accessibility,Web Design,Frontend",
    views: 134,
    likes: 25,
  }
];

async function main() {
  // Clean up existing data
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.post.deleteMany();

  // Create blog posts
  for (const postData of blogPosts) {
    try {
      const post = await prisma.post.create({
        data: {
          ...postData,
          active: true,
          date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Random date within last 30 days
        },
      });

      // Add some comments to each post
      const comment1 = await prisma.comment.create({
        data: {
          content: `Great article about ${postData.category}! Very informative.`,
          authorName: `User${Math.floor(Math.random() * 100)}`,
          postId: post.id,
        },
      });

      await prisma.comment.create({
        data: {
          content: "Thanks for sharing this knowledge!",
          authorName: `User${Math.floor(Math.random() * 100)}`,
          postId: post.id,
          parentId: comment1.id,
        },
      });

      // Add likes
      for (let i = 0; i < postData.likes; i++) {
        await prisma.like.create({
          data: {
            postId: post.id,
            userIP: `192.168.1.${i}`,
          },
        });
      }

      console.log(`Created post: ${post.title}`);
    } catch (e) {
      console.error(`Failed to create post: ${postData.title}`, e);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 