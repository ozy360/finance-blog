"use client";

import axios from "axios";
import ContainerAdmin from "@/app/components/containerAdmin";
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import AdminNav from "@/app/components/adminNav";
import { Ellipsis, CloudUpload, Copy, Trash } from "lucide-react";
import {
  Button,
  Dialog,
  Flex,
  Text,
  Box,
  Em,
  AlertDialog,
  Card,
  DropdownMenu,
} from "@radix-ui/themes";
import { Toaster, toast } from "sonner";
import LoadingSpinner from "@/app/components/loadingSpinner";

interface ImageData {
  _id: string;
  images: string[];
  deletehash: string[];
  __v: number;
}

export default function AdminMedia() {
  const [loadMore, setLoadMore] = useState(12);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [uploadImages, setUploadImages] = useState([]);
  const [imageData, setImageData] = useState<ImageData[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [mId, setMid] = useState<any>();
  const [dId, setDid] = useState<any>();

  useEffect(() => {
    getMediaData();
  }, []);

  async function getMediaData() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/media");

      if (res.ok) {
        const cdata = await res.json();
        if (!cdata.error) {
          setImageData(Array.isArray(cdata) ? cdata : ([cdata] as any));
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  const onDrop = useCallback((acceptedFiles: any) => {
    setUploadImages(acceptedFiles);
  }, []);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg", ".jpeg"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    },
    // maxFiles: 3,
    onDrop,
  });

  const acceptedFileItems = acceptedFiles.map((file: any) => (
    <li className="inline-block pr-2" key={file.path}>
      {file.path}
    </li>
  ));

  async function sendFile() {
    // if (uploadData.name || uploadData.price || uploadData.details === "")
    //   return;
    // if (!uploadImages.length) return;
    // console.log(uploadData);
    // console.log(uploadImages);

    const formdata = new FormData();

    uploadImages.forEach((x, index) => {
      console.log(`image-${index}`, x);
      formdata.append(`image-${index}`, x);
    });

    try {
      setIsLoading(true);
      const res = await axios.post("/api/media/upload", formdata);

      const cdata = res.data;
      if (cdata.message) {
        window.location.reload();
      } else if (cdata.error) {
        console.error(cdata.error);
        window.location.reload();
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error(error.response?.data?.error || "An error occurred");
    }
  }

  async function copyToClipboard(copyText: string) {
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(copyText);
      return toast.success("Copied");
    }
  }

  async function deleteFunc() {
    const formdata = new FormData();
    formdata.append("mid", mId);
    formdata.append("did", dId);
    try {
      setIsLoading(true);
      const res = await axios.post("/api/media/delete", formdata);
      const cdata = res.data;
      if (cdata.message) {
        window.location.reload();
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error(error.response?.data?.error || "An error occurred");
    }
  }

  const handleClick = (mid: string, did: string) => {
    setMid(mid);
    setDid(did);
    setAlertOpen(true);
  };

  const loadMoreFunc = () => {
    if (loadMore < imageData[0]?.images.length) {
      setIsLoading(true);
      setLoadMore((loadMore) => Number(loadMore) + 12);
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
        <Toaster position="bottom-center" richColors />

        <AdminNav openDialog={() => setDialogOpen(true)} />

        <div className="px-4 md:px-8 mx-auto mt-10 pb-20">
          <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
            <Dialog.Content
              maxWidth="450px"
              onPointerDownOutside={(event) => event.preventDefault()}
              onInteractOutside={(event) => event.preventDefault()}
            >
              <Dialog.Title></Dialog.Title>
              <Dialog.Description></Dialog.Description>

              <Flex gap="3" mt="4" mb="16">
                <div className="text-center text-[#a3a3a3] cursor-pointer border-dashed border-2 border-[#a3a3a3] border rounded-lg p-10">
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className="flex justify-center items-center text-sm mb-3">
                      <CloudUpload size={60} strokeWidth={1.2} />
                    </div>
                    <span>
                      Drag n drop some files here, or click to select files
                    </span>
                    <p></p>
                    {/* <em>(3 Max files)</em> */}
                    <ul>{acceptedFileItems}</ul>
                  </div>
                </div>
              </Flex>

              <Flex gap="3" justify="end" className="mt-8">
                <Dialog.Close>
                  <Button variant="soft" color="gray">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Dialog.Close>
                  <Button onClick={sendFile}>Save</Button>
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
                    onClick={() => deleteFunc()}
                  >
                    Yes, delete
                  </Button>
                </AlertDialog.Action>
              </Flex>
            </AlertDialog.Content>
          </AlertDialog.Root>

          {imageData && imageData.length > 0 && (
            <div>
              <div className="flex items-center justify-between pb-6">
                <div className="text-2xl">
                  Images [
                  {imageData.map((x: any) => (
                    <span key={x}>{x.images.length}</span>
                  ))}
                  ]
                </div>
                <div></div>
              </div>
              {imageData
                .map((x: ImageData, outerIndex) => (
                  <div
                    className="columns-1 space-y-7 sm:columns-2 sm:gap-8 md:columns-3 lg:columns-4 [&>img:not(:first-child)]:mt-8"
                    key={x._id || outerIndex}
                  >
                    {x.images &&
                      x.images
                        // ?.slice(0, Number(loadMore))
                        .map((imageUrl, imgIndex) => (
                          <Card
                            key={`img-${outerIndex}-${imgIndex}`}
                            className="group relative break-inside-avoid"
                          >
                            <img
                              src={imageUrl}
                              className="w-full bg-gray-200 cursor-pointer rounded-md"
                              loading="lazy"
                            />

                            <div className="flex gap-x-2 mt-2">
                              <Button
                                color="gray"
                                variant="surface"
                                onClick={() =>
                                  copyToClipboard(
                                    `<img src="${x.images?.[imgIndex]}" />`
                                  )
                                }
                              >
                                <Copy size={16} strokeWidth={2} />
                              </Button>
                              <Button
                                variant="surface"
                                color="gray"
                                onClick={() =>
                                  handleClick(
                                    x.images?.[imgIndex],
                                    x.deletehash?.[imgIndex]
                                  )
                                }
                              >
                                <Trash size={16} strokeWidth={2} />
                              </Button>
                            </div>
                          </Card>
                        ))
                        .reverse()}
                  </div>
                ))
                .reverse()}
            </div>
          )}

          {!imageData && (
            <div className="grid place-items-center h-[calc(100vh-180px)] overflow-hidden">
              <div className="flex flex-col space-y-6 items-center">
                <span className="text-lg">Nothing yet ...</span>
                <Button variant="surface" onClick={() => setDialogOpen(true)}>
                  Add Image
                </Button>
              </div>
            </div>
          )}

          {/* {imageData.length > 0 && (
            <div className="mt-20">
              <Button
                variant="surface"
                onClick={loadMoreFunc}
                disabled={loadMore >= imageData[0]?.images.length}
              >
                {loadMore >= imageData[0]?.images.length
                  ? "No more images"
                  : "Load more"}
              </Button>
            </div>
          )} */}
        </div>
      </>
    </div>
  );
}
