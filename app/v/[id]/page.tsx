import { notFound } from "next/navigation";
import PostClient from "./postClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_URL || "https://finance-blog-phi.vercel.app/";

  const res = await fetch(`${url}/api/post/${id}`);
  const post = await res.json();

  const description = post.content
    ? post.content.slice(0, 150).replace(/<[^>]+>/g, "")
    : "Read this article.";

  const imageUrl = extractImageUrl(post.imageUrl);

  return {
    title: `${post.title || "Untitled"} | ${process.env.NEXT_PUBLIC_NAME}`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `${url}/v/${id}`,
      images: [{ url: imageUrl, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${url}/v/${id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    keywords: post.tags?.split(",") || [],
  };
}

// Helper to extract src from image HTML string
function extractImageUrl(imageHtml: string) {
  const match = /src="([^"]+)"/.exec(imageHtml);
  return match ? match[1] : "/default-image.jpg";
}

export default async function ViewPost({ params }: PageProps) {
  const { id } = await params;

  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_URL || "https://www.businessdisrupts.com";

  const res = await fetch(`${url}/api/post/${id}`, {
    cache: "no-store",
  });

  const post = await res.json();

  const commentRes = await fetch(`${url}/api/comment/${id}`, {
    cache: "no-store",
  });
  const comments = await commentRes.json();

  const allPostsRes = await fetch(`${url}/api/post/`, {
    cache: "no-store",
  });

  if (!allPostsRes.ok || !commentRes || !res) {
    notFound(); // Handle fetch errors by showing 404 page
  }

  const allPosts = await allPostsRes.json();

  return <PostClient post={post} comments={comments} allPosts={allPosts} />;
}
