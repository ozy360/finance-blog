"use client";

import "swiper/css";
import { useEffect, useState } from "react";
import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Text } from "@radix-ui/themes";
import MainNav from "./mainNav";
import MainFooter from "./mainFooter";

interface ContainerAdminProps {
  children: ReactNode;
}

const MainPage: React.FC<ContainerAdminProps> = ({ children }) => {
  const router = useRouter();

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

  const [postsData, setPostsData] = useState<String[]>([]);
  const [loading, setLoading] = useState(true);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
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

    fetchPosts();
    setScreenWidth(window.innerWidth);

    const handleResize = () => {
      const newWidth = window.innerWidth;
      setScreenWidth(newWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!postsData.length) {
    return <div></div>;
  }

  return (
    <>
      <MainNav />
      <div className="px-4 md:px-8 mx-auto pb-20 lg:pb-40">
        {/*  */}

        <div className="mt-12 lg:mt-18 grid grid-cols-1 lg:grid-cols-12 lg:space-x-10">
          <div className="col-span-9">{children}</div>

          <div className="mt-20 lg:mt-0 col-span-3">
            <div className="w-[100%] sm:w-[90%] md:w-[80%] lg:w-[100%] space-y-20">
              <div>
                <div className="heading">Tags</div>
                <div className="flex gap-2 flex-wrap">
                  {financeTags.map((x: any, index) => (
                    <Button
                      variant="soft"
                      key={index}
                      onClick={() => router.push(`/tags/${x}`)}
                    >
                      {x}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                {postsData.length > 2 && (
                  <>
                    <h1 className="heading mb-6 text-2xl font-medium">
                      Popular Stories
                    </h1>
                    <div className="space-y-8">
                      {postsData.slice(0, 4).map((x: any, index: number) => (
                        <div
                          key={index}
                          className="mt-4 cursor-pointer underline hover:no-underline"
                          onClick={() =>
                            router.push(
                              `/v/${x.title
                                .replace(/[^\w\s]/g, "")
                                .split(" ")
                                .join("-")}`
                            )
                          }
                        >
                          {x.title}
                        </div>
                        // <Card
                        //   className="space-y-4 p-2 break-inside-avoid"
                        //   key={index}
                        // >
                        //   <div className="roundedimg">
                        //     <div
                        //       dangerouslySetInnerHTML={{
                        //         __html: x.imageUrl,
                        //       }}
                        //     />
                        //   </div>
                        //   <div className="text-sm">{x.date}</div>

                        //   <div className="mt-4">{x.title}</div>
                        //   <Button
                        //     variant="surface"
                        //     size="2"
                        //     onClick={() =>
                        //       router.push(
                        //         `/v/${x.title
                        //           .replace(/[^\w\s]/g, "")
                        //           .split(" ")
                        //           .join("-")}`
                        //       )
                        //     }
                        //   >
                        //     Read more
                        //   </Button>
                        // </Card>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <MainFooter />
    </>
  );
};

export default MainPage;
