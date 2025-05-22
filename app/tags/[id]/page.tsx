"use client";

import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { Button, Card } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import MainPage from "@/app/components/mainPage";
import MainPagination from "@/app/components/mainPagination";
import LoadingSpinner from "@/app/components/loadingSpinner";

export default function Tags() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [currentItems, setCurrentItems] = useState<String[]>([]);
  const [uid, setUid] = useState<String>();

  const handleCurrentItemsChange = (items: String[]) => {
    setCurrentItems(items);
  };

  useEffect(() => {
    const id = String(params.id);
    setUid(id);
    fetchPosts();
  }, []);

  const [postsData, setPostsData] = useState<String[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await fetch("/api/post");

      const cdata = await res.json();
      if (!cdata.error) {
        setPostsData(cdata);
      }
    } catch (err: any) {
      console.error("Error fetching user:", err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  const filteredItems = currentItems
    ?.filter((x: any) => x.tags.split(",").includes(uid))
    .reverse();

  if (!uid) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <MainPage>
        <div className="columns-1 space-y-7 columns-1 sm:gap-8 md:columns-2 [&>img:not(:first-child)]:mt-8">
          {filteredItems && filteredItems.length > 0 ? (
            filteredItems.map((x: any, index: number) => (
              <Card className="space-y-4 p-2 break-inside-avoid" key={index}>
                <div className="roundedimg">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: x.imageUrl,
                    }}
                  />
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(x.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {x.tags &&
                    x.tags.split(",").map((tagx: string, tagxIndex: number) => (
                      <Button
                        variant="soft"
                        size="1"
                        key={tagxIndex}
                        onClick={() => router.push(`/tags/${tagx}`)}
                      >
                        {tagx}
                      </Button>
                    ))}
                </div>
                <div className="mt-4">{x.title}</div>

                <Button
                  variant="surface"
                  size="2"
                  onClick={() =>
                    router.push(
                      `/v/${x.title
                        .replace(/[^\w\s]/g, "")
                        .split(" ")
                        .join("-")}`
                    )
                  }
                >
                  Read more
                </Button>
                {/* <div
          className=""
          dangerouslySetInnerHTML={{
            __html: x.content
              .replaceAll("&lt;", "<")
              .replaceAll("&gt;", ">")
              .slice(0, 300),
          }}
        /> */}
              </Card>
            ))
          ) : (
            <div className="text-center text-gray-500 mt-10">
              No posts found with this tag.
            </div>
          )}
        </div>
        <div>
          <MainPagination
            postsData={postsData}
            onCurrentItemsChange={handleCurrentItemsChange}
          />
        </div>
      </MainPage>
    </>
  );
}
