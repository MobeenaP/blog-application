import { redirect } from "next/navigation";
import { isLoggedIn } from "@/utils/auth";
import { client } from "@repo/db/client";
import { PostForm } from "@/components/Blog/Detail";

interface PageProps {
  params: Promise<{ urlId: string }>;
}

const prisma = client.db;

export default async function Page({ params }: PageProps) {
  const loggedIn = await isLoggedIn();
  if (!loggedIn) {
    redirect("/login");
  }

  const { urlId } = await params;

  const post = await prisma.post.findUnique({
    where: { urlId },
  });

  if (!post) {
    return <div>Post not found</div>;
  }

  return <PostForm initialData={post} />;
}
