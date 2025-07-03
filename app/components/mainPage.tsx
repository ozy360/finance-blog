import MainPageClient from "./mainPageClient";

export default async function ViewPost() {
  const allPostsRes = await fetch(`http://localhost:3000/api/post/`, {
    cache: "no-store",
  });
  const allPosts = await allPostsRes.json();

  return <MainPageClient postsData={allPosts}></MainPageClient>;
}
