import PageClient from "./pageClient";

export default async function ViewPost() {
  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_URL || "https://finance-blog-phi.vercel.app/";
  const allPostsRes = await fetch(`${url}/api/post/`, {
    cache: "no-store",
  });
  const allPosts = await allPostsRes.json();

  return <PageClient postsData={allPosts} />;
}
