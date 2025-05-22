"use client";

import axios from "axios";
import { Toaster, toast } from "sonner";
import MainNav from "@/app/components/mainNav";
import MainFooter from "@/app/components/mainFooter";
import { ThumbsUp, Share2 } from "lucide-react";
import LoadingSpinner from "@/app/components/loadingSpinner";

import {
  AlertDialog,
  TextArea,
  TextField,
  Button,
  Flex,
  Card,
  Text,
} from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function viewPost() {
  const date = new Date();
  const options: any = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const newdate = date.toLocaleString("en-US", options);

  const router = useRouter();
  const params = useParams();
  const [post, setPost] = useState<any>();

  const [otherPosts, setOtherPosts] = useState<any>();
  const [likeValue, setLikeValue] = useState<any>();
  const [like, setLike] = useState<boolean>(false);
  const [share, setShare] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>();
  const [alertOpen, setAlertOpen] = useState(false);
  const [commentId, setCommentId] = useState<string>();
  const [replying, setReplying] = useState<string>();
  const [getComment, setGetComment] = useState<string[]>([]);
  const [commentObj, setCommentObj] = useState<any>({
    name: "",
    email: "",
    comment: "",
  });

  const [replyCommentObj, setReplyCommentObj] = useState<any>({
    name: "",
    replying: "",
    email: "",
    comment: "",
  });

  const [postsData, setPostsData] = useState<String[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await fetch("/api/post");

      const cdata = await res.json();
      if (!cdata.error) {
        setPostsData(cdata);
        setLikeValue(cdata.likes || 0);
        const uid = String(params.id);
        fetchPost(uid);
      }
    } catch (err: any) {
      console.error("Error fetching user:", err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPost(uid: string) {
    setIsLoading(true);
    try {
      const res = await axios.post(`/api/post/${uid}`, {
        id: uid,
      });

      const cdata = res.data;
      if (cdata.error) {
        router.push("/");
      } else {
        setPost(cdata);
        setLikeValue(cdata.likes);
        fetchComment(cdata._id);
      }
    } catch (error) {
      router.push("/");
      console.error("Error fetching post:", error);
    }
  }

  async function fetchComment(pid: string) {
    try {
      const res = await axios.post(`/api/comment/${pid}`, {
        pid: pid,
      });

      const cdata = res.data;
      if (!cdata.error) {
        setGetComment(Array.isArray(cdata) ? cdata : ([cdata] as any));
        setIsLoading(false);
      }
    } catch (error) {
      router.push("/");
      console.error("Error fetching user:", error);
    }
  }

  async function commentFunc() {
    if (commentObj && post._id) {
      try {
        setIsLoading(true);
        const res = await axios.post(`/api/comment/upload`, {
          pid: post._id,
          name: commentObj.name,
          date: newdate,
          email: commentObj.email,
          comment: commentObj.comment,
          action: "addComment",
        });

        const cdata = res.data;

        if (!cdata.error) {
          setIsLoading(false);
          setCommentObj({
            name: "",
            email: "",
            comment: "",
          });
          fetchComment(post._id);
        }
      } catch (error: any) {
        setIsLoading(false);
        console.error(error.response?.data?.error || "An error occurcrimson");
      }
    }
  }

  async function replyFunc() {
    if (replyCommentObj && commentId && replying) {
      try {
        setIsLoading(true);
        const res = await axios.post(`/api/comment/upload`, {
          commentId: commentId,
          name: replyCommentObj.name,
          date: newdate,
          replying: replying,
          email: replyCommentObj.email,
          comment: replyCommentObj.comment,
          action: "replyComment",
        });

        const cdata = res.data;

        if (!cdata.error) {
          setIsLoading(false);
          setReplyCommentObj({
            name: "",
            email: "",
            comment: "",
          });
          fetchComment(post._id);
        }
      } catch (error: any) {
        setIsLoading(false);
        console.error(error.response?.data?.error || "An error occurcrimson");
      }
    }
  }

  async function likeFunc() {
    if (!like) {
      const newLikeValue = likeValue + 1 || 1;
      setLikeValue(newLikeValue);
      setLike(true);

      if (newLikeValue !== 0) {
        try {
          const res = await axios.post(`/api/post/like`, {
            id: post._id,
            like: newLikeValue,
          });

          const cdata = res.data;

          if (!cdata.error) {
            setIsLoading(false);
          }
        } catch (error: any) {
          setIsLoading(false);
          console.error(error.response?.data?.error || "An error occurred");
        }
      }
    }
  }

  function urlCopied() {
    setShare(true);
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  }

  if (!post) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  const filteredPosts = postsData.filter((x: any) => x._id !== post._id);
  const shuffledPosts = filteredPosts.sort(() => 0.5 - Math.random());
  const selectedPosts = shuffledPosts.slice(0, 4);

  return (
    <>
      <Toaster position="bottom-center" richColors />
      <MainNav />
      <AlertDialog.Root open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Reply {replying}</AlertDialog.Title>
          <AlertDialog.Description size="2"></AlertDialog.Description>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 space-y-4 gap-x-2">
            <div className="col-span-1">
              <label>Name</label>
              <TextField.Root
                variant="surface"
                value={replyCommentObj.name}
                type="text"
                size="2"
                className="w-full"
                onChange={(e) =>
                  setReplyCommentObj({
                    ...replyCommentObj,
                    name: e.target.value,
                  })
                }
                autoComplete="off"
              />
            </div>

            <div className="col-span-1">
              <p>Email</p>
              <TextField.Root
                variant="surface"
                value={replyCommentObj.email}
                type="email"
                size="2"
                className="w-full"
                onChange={(e) =>
                  setReplyCommentObj({
                    ...replyCommentObj,
                    email: e.target.value,
                  })
                }
                autoComplete="off"
              />
            </div>

            <div className="col-span-2">
              {" "}
              <label>Comment</label>
              <TextArea
                variant="surface"
                value={replyCommentObj.comment}
                size="2"
                className="w-full"
                onChange={(e) =>
                  setReplyCommentObj({
                    ...replyCommentObj,
                    comment: e.target.value,
                  })
                }
                autoComplete="off"
              />
            </div>

            {/* <Button variant="soft" onClick={replyFunc}>
              Submit
            </Button> */}
          </div>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            {/* onClick={() => deleteFunc(id)} */}
            <AlertDialog.Action>
              <Button variant="surface" onClick={() => replyFunc()}>
                Submit comment
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
      <div className="pt-10 pb-20 px-4 md:px-8">
        <div className="lg:w-[50%] mx-auto md:px-0">
          <div className="space-y-4">
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
            </div>{" "}
            <div className="py-2">
              <div
                dangerouslySetInnerHTML={{
                  __html: post.imageUrl,
                }}
              />
            </div>
            <div
              className="lg:text-lg leading-8 text-body"
              dangerouslySetInnerHTML={{
                __html: post.content
                  .replaceAll("&lt;", "<")
                  .replaceAll("&gt;", ">"),
              }}
            />
          </div>
          <div className="mt-10">
            <div className="flex gap-2 flex-wrap">
              {post.tags &&
                post.tags.split(",").map((tagx: string, tagxIndex: number) => (
                  <Button
                    variant="soft"
                    size="2"
                    key={tagxIndex}
                    onClick={() => router.push(`/tags/${tagx}`)}
                  >
                    {tagx}
                  </Button>
                ))}
            </div>
          </div>
        </div>

        <div className="mt-20 lg:w-[50%] mx-auto">
          <div className="text-lg lg:text-xl font-medium mb-4">
            Add a comment
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className=" md:col-span-1">
              <p>Name</p>
              <TextField.Root
                variant="surface"
                value={commentObj.name}
                type="text"
                size="2"
                className="w-full"
                onChange={(e) =>
                  setCommentObj({ ...commentObj, name: e.target.value })
                }
                autoComplete="off"
              />
            </div>

            <div className=" md:col-span-1">
              <p>Email</p>
              <TextField.Root
                variant="surface"
                value={commentObj.email}
                type="email"
                size="2"
                className="w-full"
                onChange={(e) =>
                  setCommentObj({ ...commentObj, email: e.target.value })
                }
                autoComplete="off"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              {" "}
              <p>Comment</p>
              <TextArea
                variant="surface"
                value={commentObj.comment}
                size="2"
                className="w-full"
                onChange={(e) =>
                  setCommentObj({ ...commentObj, comment: e.target.value })
                }
                autoComplete="off"
              />
            </div>

            <Button
              variant="surface"
              onClick={commentFunc}
              className="col-span-1"
            >
              Submit
            </Button>
          </div>

          <div className="mt-16 mb-10 space-y-12">
            {getComment.map((x: any, index: number) => (
              <div key={index}>
                <div className="space-y-2">
                  <div className="font-medium text-lg">{x.name}</div>
                  <Text className="text-sm text-gray-500" color="gray">
                    {x.date}
                  </Text>

                  <div>{x.comment}</div>
                  <div className="flex justify-between border-t pt-4 border-gray-400">
                    <div></div>
                    <Button
                      variant="soft"
                      onClick={() => {
                        setReplying(x.name);
                        setCommentId(x._id);
                        setAlertOpen(true);
                      }}
                    >
                      Reply
                    </Button>
                  </div>
                </div>

                {x.replies &&
                  x.replies.map((reply: any) => (
                    <div key={reply._id} className="space-y-2 pl-14">
                      <div>
                        <span className="font-medium text-lg">
                          {reply.name}
                        </span>{" "}
                        <span className="text-sm">
                          replied{" "}
                          <span className="font-medium text-lg">
                            {reply.replying}
                          </span>
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">{reply.date}</div>

                      <div>{reply.comment}</div>
                      <div className="flex justify-between border-t pt-4 border-gray-400">
                        <div></div>
                        <Button
                          variant="soft"
                          onClick={() => {
                            setReplying(reply.name);
                            setCommentId(x._id);
                            setAlertOpen(true);
                          }}
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        {selectedPosts.length > 1 && (
          <div>
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
