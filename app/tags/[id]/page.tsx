import { notFound } from "next/navigation";
import TagClient from "./tagClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewPost({ params }: PageProps) {
  const { id } = await params;

  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_URL || "https://finance-blog-phi.vercel.app/";

  const allPostsRes = await fetch(`${url}/api/post/`, {
    cache: "no-store",
  });

  if (!allPostsRes.ok) {
    notFound();
  }

  const allPosts = await allPostsRes.json();

  return <TagClient postsData={allPosts} uid={id} />;
}
