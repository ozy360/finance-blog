"use client";

import { useRouter } from "next/navigation";
import { Button, Card } from "@radix-ui/themes";
import { useState } from "react";
import MainPageClient from "@/app/components/mainPageClient";
import MainPagination from "@/app/components/mainPagination";

export default function TagClient({ postsData, uid }: any) {
  const router = useRouter();
  const [currentItems, setCurrentItems] = useState<String[]>([]);

  const handleCurrentItemsChange = (items: String[]) => {
    setCurrentItems(items);
  };

  return (
    <>
      <MainPageClient postsData={postsData}>
        <div className="columns-1 space-y-7 columns-1 sm:gap-8 md:columns-2 [&>img:not(:first-child)]:mt-8">
          {currentItems && currentItems.length > 0 ? (
            currentItems.map((x: any, index: number) => (
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
            uid={uid}
          />
        </div>
      </MainPageClient>
    </>
  );
}
