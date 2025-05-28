import { redirect } from "next/navigation";
import { isLoggedIn } from "@/utils/auth";
import { client } from "@repo/db/client";
import { BlogPageClientWrapper } from "../components/Blog/BlogPageClientWrapper";

const prisma = client.db;

export default async function Home() {
  const loggedIn = await isLoggedIn();
  if (!loggedIn) {
    redirect("/login");
  }

  const posts = await prisma.post.findMany({
    orderBy: { date: "desc" },
  });

  return ( 
    <BlogPageClientWrapper posts={posts} />
  );
}