export type Post = {
  id: number;
  urlId: string;
  title: string;
  content: string;
  description: string;
  imageUrl: string;
  date: Date;
  category: string;
  views: number;
  likes: number;
  tags: string;
  active: boolean;
  comments?: Comment[];
};

export type Comment = {
  id: number;
  content: string;
  authorName: string;
  createdAt: Date;
  postId: number;
  parentId?: number | null;
  replies?: Comment[];
};

const content = `
  # Title 1

  Illo **sint voluptas**. Error voluptates culpa eligendi. 
  Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
  Sed exercitationem placeat consectetur nulla deserunt vel 
  iusto corrupti dicta laboris incididunt.

  ## Subtitle 1

  Illo sint *voluptas*. Error voluptates culpa eligendi. 
  Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
  Sed exercitationem placeat consectetur nulla deserunt vel 
  iusto corrupti dicta laboris incididunt.
`;

const description = `Illo sint voluptas. Error voluptates culpa eligendi. 
Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
Sed exercitationem placeat consectetur nulla deserunt vel 
iusto corrupti dicta laboris incididunt.`;

export const blogData = {
  posts: [
    {
      id: 1,
      title: "Boost your conversion rate",
      urlId: "boost-your-conversion-rate",
      description,
      content: content + " ... post1",
      imageUrl:
        "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&auto=format&fit=crop&w=3603&q=80",
      date: new Date("Apr 18, 2022"),
      category: "Node",
      tags: "Back-End,Databases",
      views: 320,
      likes: 3,
      active: true,
    },
    {
      id: 2,
      title: "Better front ends with Fatboy Slim",
      urlId: "better-front-ends-with-fatboy-slim",
      description: `Illo sint voluptas. Error voluptates culpa eligendi. 
         Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
         Sed exercitationem placeat consectetur nulla deserunt vel 
         iusto corrupti dicta laboris incididunt.`,
      content: content + " ... post2",
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1661342428515-5ca8cee4385a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3",
      date: new Date("Mar 16, 2020"),
      category: "React",
      tags: "Front-End,Optimisation",
      views: 10,
      likes: 1,
      active: true,
    },
    {
      id: 3,
      title: "No front end framework is the best",
      urlId: "no-front-end-framework-is-the-best",
      description: `Illo sint voluptas. Error voluptates culpa eligendi. 
         Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
         Sed exercitationem placeat consectetur nulla deserunt vel 
         iusto corrupti dicta laboris incididunt.`,
      content: content + " ... post3",
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1661517706036-a48d5fc8f2f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      date: new Date("Dec 16, 2024"),
      category: "React",
      tags: "Front-End,Dev Tools",
      views: 22,
      likes: 2,
      active: true,
    },
    {
      id: 4,
      title: "Visual Basic is the future",
      urlId: "visual-basic-is-the-future",
      description: `Illo sint voluptas. Error voluptates culpa eligendi. 
         Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
         Sed exercitationem placeat consectetur nulla deserunt vel 
         iusto corrupti dicta laboris incididunt.`,
      content: content + " ... post4",
      imageUrl: "https://m.media-amazon.com/images/I/51NqEfmmBTL.jpg",
      date: new Date("Dec 16, 2012"),
      category: "React",
      tags: "Programming,Mainframes",
      views: 22,
      likes: 1,
      active: false,
    },
  ],
  categories: [
    { name: 'Technology', count: 1 },
    { name: 'General', count: 1 }
  ],
  tags: [
    { name: 'welcome', count: 1 },
    { name: 'introduction', count: 1 },
    { name: 'nextjs', count: 1 },
    { name: 'react', count: 1 },
    { name: 'tutorial', count: 1 }
  ],
  history: [
    { title: 'Welcome to Our Blog', urlId: 'welcome-to-our-blog' },
    { title: 'Getting Started with Next.js', urlId: 'getting-started-with-nextjs' }
  ]
};
