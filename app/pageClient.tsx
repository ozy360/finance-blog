"use client";

import { useRouter } from "next/navigation";
import { Button, Card } from "@radix-ui/themes";
import { useState, useCallback } from "react";
import MainPageClient from "./components/mainPageClient";
import MainPagination from "./components/mainPagination";

export default function PageClient({ postsData }: any) {
  const router = useRouter();

  const [currentItems, setCurrentItems] = useState<String[]>([]);

  const handleCurrentItemsChange = useCallback((items: String[]) => {
    setCurrentItems(items);
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <MainPageClient postsData={postsData}>
        <h1 className="heading">
          Click{" "}
          <a href="/login" className="underline hover:no-underline">
            here
          </a>{" "}
          to go to dashboard
        </h1>

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
            uid={""}
          />
        </div>
      </MainPageClient>
    </>
  );
}
