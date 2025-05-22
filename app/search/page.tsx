"use client";

import { Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Button, Card } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import MainPage from "@/app/components/mainPage";
import MainPagination from "@/app/components/mainPagination";
import LoadingSpinner from "../components/loadingSpinner";

function SearchComponent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const x = String(searchParams.get("x"));

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentItems, setCurrentItems] = useState<String[]>([]);
  const [searchQuery, setSearchQuery] = useState<String>();
  const [searchedData, setSearchedData] = useState<String[]>([]);

  const handleCurrentItemsChange = (items: String[]) => {
    setCurrentItems(items);
  };

  useEffect(() => {
    urlSearch(x);
  }, []);

  async function urlSearch(query: String) {
    fetch(`/api/search?query=${encodeURIComponent(query as any)}`)
      .then((res) => res.json())
      .then((data) => {
        setSearchedData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  if (isLoading) {
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
          {searchedData && searchedData.length > 0 ? (
            searchedData
              .map((x: any, index: number) => (
                <Card className="space-y-4 p-2 break-inside-avoid" key={index}>
                  <div className="roundedimg">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: x.imageUrl,
                      }}
                    />
                  </div>
                  <div className="text-sm">{x.date}</div>
                  <div className="flex gap-2 flex-wrap">
                    {x.tags &&
                      x.tags
                        .split(",")
                        .map((tagx: string, tagxIndex: number) => (
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
              .reverse()
          ) : (
            <div className="text-center text-gray-500 mt-10">
              No search result.
            </div>
          )}
        </div>
        <div>
          <MainPagination
            postsData={searchedData}
            onCurrentItemsChange={handleCurrentItemsChange}
          />
        </div>
      </MainPage>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div></div>}>
      <SearchComponent />
    </Suspense>
  );
}
