// app/lib/posts.ts
export async function getAllPosts() {
  try {
    // const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/post`, {
    const res = await fetch(`http://localhost:3000/api/post`, {
      cache: "no-store", // or "force-cache" if caching is okay
    });

    if (!res.ok) throw new Error("Failed to fetch posts");

    return await res.json();
  } catch (err) {
    console.error("Error fetching posts:", err);
    return [];
  }
}
