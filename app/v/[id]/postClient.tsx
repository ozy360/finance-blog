"use client";

import { useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { ThumbsUp, Share2 } from "lucide-react";
import { TextField, TextArea, Button, Card } from "@radix-ui/themes";
import MainNav from "@/app/components/mainNav";
import MainFooter from "@/app/components/mainFooter";
import { useRouter } from "next/navigation";

export default function PostClient({ post, comments, allPosts }: any) {
  const [likeValue, setLikeValue] = useState(post.likes || 0);
  const [like, setLike] = useState(false);
  const [share, setShare] = useState(false);
  const [commentObj, setCommentObj] = useState({
    name: "",
    email: "",
    comment: "",
  });
  const [getComment, setGetComment] = useState(comments || []);
  const router = useRouter();

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const likeFunc = async () => {
    if (like) return;
    setLikeValue(likeValue + 1);
    setLike(true);
    await axios.post("/api/post/like", { id: post._id, like: likeValue + 1 });
  };

  const commentFunc = async () => {
    await axios.post(`/api/comment/upload`, {
      pid: post._id,
      name: commentObj.name,
      date,
      email: commentObj.email,
      comment: commentObj.comment,
      action: "addComment",
    });

    setCommentObj({ name: "", email: "", comment: "" });

    const res = await fetch(`/api/comment/${post._id}`);
    const updatedComments = await res.json();
    setGetComment(updatedComments);
  };

  const urlCopied = () => {
    setShare(true);
    navigator.clipboard.writeText(window.location.href);
    toast.success("URL copied to clipboard");
  };

  const filteredPosts = allPosts.filter((x: any) => x._id !== post._id);
  const shuffledPosts = filteredPosts.sort(() => 0.5 - Math.random());
  const selectedPosts = shuffledPosts.slice(0, 4);

  return (
    <>
      <Toaster position="bottom-center" richColors />
      <MainNav />
      <div className="pt-10 pb-20 px-4 md:px-8">
        <div className="lg:w-[50%] mx-auto md:px-0 space-y-4">
          <div className="flex items-center justify-between pb-3">
            <div className="flex">
              <Card
                className="rounded-md lg:hidden cursor-pointer !p-2 mr-2"
                onClick={likeFunc}
              >
                <div className="flex space-x-1">
                  <ThumbsUp
                    size={18}
                    strokeWidth={1.6}
                    fill={like ? "grey" : "transparent"}
                  />
                  <span className="text-sm">{likeValue}</span>
                </div>
              </Card>

              <Card
                className="rounded-md lg:hidden cursor-pointer !p-2"
                onClick={urlCopied}
              >
                <Share2
                  size={18}
                  strokeWidth={1.6}
                  fill={share ? "grey" : "transparent"}
                />
              </Card>
              <div></div>
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-medium">{post.title}</div>
          <div className="text-sm text-gray-600">
            Posted on{" "}
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div dangerouslySetInnerHTML={{ __html: post.imageUrl }} />
          <div
            className="lg:text-lg leading-8 text-body"
            dangerouslySetInnerHTML={{
              __html: post.content
                .replaceAll("&lt;", "<")
                .replaceAll("&gt;", ">"),
            }}
          />

          <div className="mt-10">
            <div className="flex gap-2 flex-wrap">
              {post.tags?.split(",").map((tagx: string, i: number) => (
                <Button
                  key={i}
                  variant="soft"
                  size="2"
                  onClick={() => router.push(`/tags/${tagx}`)}
                >
                  {tagx}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-20">
            <div className="text-lg lg:text-xl font-medium mb-4">
              Add a comment
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField.Root
                placeholder="Name"
                value={commentObj.name}
                onChange={(e) =>
                  setCommentObj({ ...commentObj, name: e.target.value })
                }
              />
              <TextField.Root
                placeholder="Email"
                value={commentObj.email}
                onChange={(e) =>
                  setCommentObj({ ...commentObj, email: e.target.value })
                }
              />
              <TextArea
                className="md:col-span-2"
                placeholder="Comment"
                value={commentObj.comment}
                onChange={(e) =>
                  setCommentObj({ ...commentObj, comment: e.target.value })
                }
              />
              <Button
                variant="surface"
                onClick={commentFunc}
                className="col-span-1"
              >
                Submit
              </Button>
            </div>

            <div className="mt-10 space-y-6">
              {getComment.map((c: any, i: number) => (
                <div key={i}>
                  <div className="font-medium text-lg">{c.name}</div>
                  <div className="text-sm text-gray-500">{c.date}</div>
                  <div>{c.comment}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {selectedPosts.length > 1 && (
          <div className="mt-30">
            <h1 className="heading">More posts</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {selectedPosts.slice(0, 4).map((x: any, index: number) => (
                <Card
                  className="space-y-4 p-2 break-inside-avoid cursor-pointer"
                  key={index}
                  onClick={() =>
                    router.push(
                      `/v/${x.title
                        .replace(/[^\w\s]/g, "")
                        .split(" ")
                        .join("-")}`
                    )
                  }
                >
                  <div className="morepostsdiv">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: x.imageUrl,
                      }}
                    />
                  </div>
                  {/* <div className="text-sm">{x.date}</div> */}

                  <div className="mt-4 text-base font-medium">
                    {x.title.slice(0, 70)}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
      <MainFooter />
    </>
  );
}
