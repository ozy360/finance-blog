"use client";

import { useRouter } from "next/navigation";
import { Button, Card } from "@radix-ui/themes";
import { useState, useCallback, useEffect } from "react";
import MainPage from "./components/mainPage";
import MainPagination from "./components/mainPagination";
import LoadingSpinner from "./components/loadingSpinner";

export default function Home() {
  const router = useRouter();

  const [currentItems, setCurrentItems] = useState<String[]>([]);

  const [postsData, setPostsData] = useState<String[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCurrentItemsChange = useCallback((items: String[]) => {
    setLoading(true);
    setCurrentItems(items);
    window.scrollTo(0, 0);
    setLoading(false);
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const res = await fetch("/api/post");

        const cdata = await res.json();
        if (!cdata.error) {
          const rbreaking = cdata.filter((x: any) => x.breaking === false);
          setPostsData(rbreaking);
        }
      } catch (err: any) {
        console.error("Error fetching user:", err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (!postsData.length) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <MainPage>
        <div className="heading">
          Click{" "}
          <a href="/login" className="font-medium underline hover:no-underline">
            here
          </a>{" "}
          to access the dashboard
        </div>
        <div className="columns-1 space-y-7 columns-1 sm:gap-8 md:columns-2 [&>img:not(:first-child)]:mt-8">
          {currentItems?.map((x: any, index) => (
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
            </Card>
          ))}
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
