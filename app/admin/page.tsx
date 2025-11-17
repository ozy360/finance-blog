"use client";
import axios from "axios";
import "react-quill-new/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import AdminNav from "../components/adminNav";
import {
  Button,
  Dialog,
  Flex,
  Text,
  TextField,
  Link,
  Card,
  AlertDialog,
  Checkbox,
} from "@radix-ui/themes";
import { Calendar } from "lucide-react";
import { Toaster, toast } from "sonner";
import LoadingSpinner from "../components/loadingSpinner";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

interface Post {
  title: string;
  imageUrl: string;
  date: string;
  tags: string;
  likes?: number;
  content: string;
  slug: string;
}

export default function Admin() {
  const [checked, setChecked] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [loadMore, setLoadMore] = useState(12);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [value, setValue] = useState<any>();
  const [title, setTitle] = useState<string>();
  const [image, setImage] = useState<string>();
  const [date, setDate] = useState<any>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [post, setPost] = useState<any>();
  const [postId, setPostId] = useState<any>();
  const financeTags = [
    "Personal Finance",
    "Trading",
    "Budgeting",
    "Saving",
    "Investing",
    "Wealth",
    "Financial Literacy",
    "Smart Spending",
    "Debt",
    "Financial Freedom",
    "Money",
    "Financial Tips",
  ];

  const [tag, setTag] = useState<number[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch("/api/post");

      if (res.ok) {
        const cdata = await res.json();
        if (!cdata.error) setPosts(cdata);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  async function fetchPost(uid: string) {
    try {
      const res = await axios.post(`/api/post/${uid}`, {
        id: uid,
      });

      const cdata = res.data;

      if (!cdata.error) {
        setPost(cdata);
        setValue(cdata.content);
        setEditOpen(true);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  async function postFunc() {
    if (value && date) {
      setIsLoading(true);
      try {
        const res = await axios.post(`/api/post/upload`, {
          title: title,
          imageUrl: image,
          date: date,
          content: value,
          tags: tag.toString(),
        });

        const cdata = res.data;

        if (!cdata.error) {
          window.location.reload();
        }
      } catch (error: any) {
        setIsLoading(false);
        console.error(error.response?.data?.error || "An error occurcrimson");
      }
    }
  }

  async function editFunc(pid: string) {
    if (value) {
      setIsLoading(true);
      try {
        const res = await axios.post(`/api/post/update`, {
          id: pid,
          title: title || post.title,
          imageUrl: image || post.imageUrl,
          date: date || post.date,
          content: value || post.content,
        });

        const cdata = res.data;

        if (!cdata.error) {
          window.location.reload();
        }
      } catch (error: any) {
        setIsLoading(false);
        console.error(error.response?.data?.error || "An error occured");
      }
    }
  }

  async function deleteFunc(id: string) {
    const formdata = new FormData();
    formdata.append("id", id);
    try {
      setIsLoading(true);
      const res = await axios.post("/api/post/delete", formdata);
      const cdata = res.data;
      if (cdata.message) {
        window.location.reload();
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error(error.response?.data?.error || "An error occurcrimson");
    }
  }

  async function breakingFunc(isChecked: any, id: string) {
    try {
      const res = await axios.post(`/api/post/breaking`, {
        id: id,
        breaking: isChecked,
      });

      const cdata = res.data;

      if (!cdata.error) {
        // window.location.reload();
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error(error.response?.data?.error || "An error occured");
    }
  }

  const handleClick = (id: string) => {
    setPostId(id);
    setAlertOpen(true);
  };

  const loadMoreFunc = () => {
    if (loadMore < posts.length) {
      setIsLoading(true);
      setLoadMore((loadMore) => loadMore + 12);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <>
        <div className="">
          <AdminNav
            openDialog={() => {
              setValue("");
              setDialogOpen(true);
            }}
          />
          <div className=""></div>

          <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
            <Dialog.Content
              className="w-[80%]"
              onPointerDownOutside={(event) => event.preventDefault()}
              onInteractOutside={(event) => event.preventDefault()}
            >
              <Dialog.Title></Dialog.Title>
              <Dialog.Description></Dialog.Description>

              <div className="space-y-6">
                <TextField.Root
                  variant="surface"
                  type="text"
                  placeholder="Title"
                  className="w-full"
                  onChange={(e) => setTitle(e.target.value)}
                />

                <TextField.Root
                  variant="surface"
                  type="text"
                  placeholder="Image URL"
                  className="w-full"
                  onChange={(e) => setImage(e.target.value)}
                />

                <div className="flex gap-2 flex-wrap">
                  {financeTags.map((x: any, index) => (
                    <Button
                      variant={tag.includes(x) ? "soft" : "outline"}
                      key={index}
                      color="gray"
                      onClick={() =>
                        tag.includes(x)
                          ? setTag(tag.filter((t) => t !== x))
                          : setTag([...tag, x])
                      }
                    >
                      {x}
                    </Button>
                  ))}
                </div>

                <>
                  <div className="flex space-x-4">
                    <input
                      // variant="surface"
                      type="date"
                      className="w-inline uppercase text-sm border border-[#BBBBBB] rounded-sm p-1"
                      onChange={(e) => setDate(e.target.value)}
                    />

                    <></>

                    <></>
                  </div>
                </>

                <ReactQuill
                  theme="snow"
                  value={value}
                  onChange={setValue}
                  className="w-full h-[40vh]"
                />
              </div>

              <Flex gap="3" justify="end" className="mt-24 md:mt-16">
                <Dialog.Close>
                  <Button variant="soft" color="gray" size="2">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Dialog.Close>
                  <Button size="2" onClick={postFunc}>
                    Save
                  </Button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>

          <Dialog.Root open={editOpen} onOpenChange={setEditOpen}>
            <Dialog.Content
              className="w-[80%]"
              onPointerDownOutside={(event) => event.preventDefault()}
              onInteractOutside={(event) => event.preventDefault()}
            >
              <Dialog.Title></Dialog.Title>
              <Dialog.Description></Dialog.Description>

              <div className="space-y-6">
                <TextField.Root
                  variant="surface"
                  type="text"
                  placeholder="Title"
                  className="w-full"
                  defaultValue={post?.title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <TextField.Root
                  variant="surface"
                  type="text"
                  placeholder="Image URL"
                  className="w-full"
                  defaultValue={post?.imageUrl}
                  onChange={(e) => setImage(e.target.value)}
                />

                {/* <div className="flex gap-2 flex-wrap">
                  {financeTags.map((x: any, index) => (
                    <Button
                      variant={tag.includes(x) ? "soft" : "outline"}
                      key={index}
                      color="gray"
                      onClick={() =>
                        tag.includes(x)
                          ? setTag(tag.filter((t) => t !== x))
                          : setTag([...tag, x])
                      }
                    >
                      {x}
                    </Button>
                  ))}
                </div> */}

                {post && (
                  <div className="flex space-x-4">
                    <input
                      // variant="surface"
                      type="date"
                      className="w-inline uppercase text-sm border border-[#BBBBBB] rounded-sm p-1"
                      defaultValue={
                        post.date &&
                        !isNaN(new Date(post.date as string).getTime())
                          ? new Date(post.date as string)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) => setDate(e.target.value)}
                    />

                    <></>

                    <></>
                  </div>
                )}

                <ReactQuill
                  theme="snow"
                  value={value}
                  onChange={setValue}
                  className="w-full h-[40vh]"
                />
              </div>

              <Flex gap="3" justify="end" className="mt-24 md:mt-16">
                <Dialog.Close>
                  <Button variant="soft" color="gray" size="2">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Dialog.Close>
                  <Button size="2" onClick={() => editFunc(post._id)}>
                    Update
                  </Button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>

          <AlertDialog.Root open={alertOpen} onOpenChange={setAlertOpen}>
            <AlertDialog.Content maxWidth="450px">
              <AlertDialog.Title>Delete post</AlertDialog.Title>
              <AlertDialog.Description size="2">
                Are you sure you want to delete post?
              </AlertDialog.Description>

              <Flex gap="3" mt="4" justify="end">
                <AlertDialog.Cancel>
                  <Button variant="soft" color="gray">
                    Cancel
                  </Button>
                </AlertDialog.Cancel>
                {/* onClick={() => deleteFunc(id)} */}
                <AlertDialog.Action>
                  <Button
                    variant="solid"
                    color="gray"
                    onClick={() => deleteFunc(postId)}
                  >
                    Yes, delete
                  </Button>
                </AlertDialog.Action>
              </Flex>
            </AlertDialog.Content>
          </AlertDialog.Root>

          <div className="px-4 md:px-8 pt-10 mx-auto pb-20">
            {posts && (
              <div className="lg:flex items-center justify-between pb-6">
                <div className="text-2xl">Posts [{posts.length}]</div>
                <div></div>
                <div>
                  <TextField.Root
                    variant="surface"
                    type="text"
                    placeholder="Search..."
                    onChange={(e) => setSearch(e.target.value)}
                    className="mt-4 lg:mt-0"
                  />
                </div>
              </div>
            )}
            <div className="columns-1 space-y-7 sm:columns-2 sm:gap-8 md:columns-3 lg:columns-4 [&>img:not(:first-child)]:mt-8">
              {posts
                ?.filter((x) => {
                  return search?.toLowerCase() === ""
                    ? x
                    : x.title.toLowerCase().includes(search);
                })
                // ?.slice(0, Number(loadMore))
                // ?.reverse()
                ?.map((x: any, index) => (
                  <Card
                    key={index}
                    className="group relative break-inside-avoid !p-2"
                  >
                    <div className="space-y-4 p-2">
                      <div className="flex justify-between items-center">
                        <Text
                          className="flex gap-x-2 items-center"
                          color="gray"
                        >
                          <Calendar size={20} strokeWidth={1.4} />
                          <div className="text-sm">
                            {new Date(x.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </Text>
                        <Checkbox
                          id={x._id}
                          onCheckedChange={(isChecked) =>
                            breakingFunc(isChecked, x._id)
                          }
                          defaultChecked={x.breaking}
                        />
                      </div>
                      <div className="mt-4">{x.title.slice(0, 110)}</div>

                      <div
                        className="flex items-center gap-x-2 bottom-0 text-sm"
                        color="gray"
                      >
                        <Button
                          variant="soft"
                          color="gray"
                          size="2"
                          onClick={() => fetchPost(x.slug)}
                        >
                          Edit
                          {/* <SquarePen size={18} strokeWidth={2} /> */}
                        </Button>
                        <Button
                          variant="soft"
                          size="2"
                          color="gray"
                          onClick={() => handleClick(x._id)}
                        >
                          Delete
                          {/* <Trash size={18} strokeWidth={2} /> */}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>

            {/* {posts.length > 0 && (
              <div className="mt-20">
                <Button
                  variant="surface"
                  onClick={loadMoreFunc}
                  disabled={loadMore >= posts.length}
                >
                  {Number(loadMore) >= posts.length
                    ? "No more posts"
                    : "Load more"}
                </Button>
              </div>
            )} */}

            {!posts.length && (
              <div className="grid place-items-center h-[calc(100vh-180px)] overflow-hidden">
                <div className="flex flex-col space-y-6 items-center">
                  <p className="text-lg">Nothing yet ...</p>
                  <Button variant="surface" onClick={() => setDialogOpen(true)}>
                    Add Post
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    </div>
  );
}
