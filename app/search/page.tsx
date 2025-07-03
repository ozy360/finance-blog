import SearchClient from "./searchClient";

export default async function ViewPost({ searchParams }: any) {
  const x = searchParams?.x;

  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_URL || "https://finance-blog-phi.vercel.app/";

  const allPostsRes = await fetch(`${url}/api/post/`, {
    cache: "no-store",
  });
  const allPosts = await allPostsRes.json();

  const searchedPostsRes = await fetch(
    `${url}/api/search?query=${encodeURIComponent(x as any)}`,
    {
      cache: "no-store",
    }
  );
  const searchedPosts = await searchedPostsRes.json();

  return <SearchClient searchedData={searchedPosts} postsData={allPosts} />;
}
