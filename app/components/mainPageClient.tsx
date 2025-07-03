"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useState, useEffect } from "react";
import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@radix-ui/themes";
import MainNav from "./mainNav";
import MainFooter from "./mainFooter";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface ContainerAdminProps {
  postsData: any;
  children?: React.ReactNode;
}

const MainPageClient: React.FC<ContainerAdminProps> = ({
  children,
  postsData,
}) => {
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

  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    setScreenWidth(window.innerWidth);

    const handleResize = () => {
      if (typeof window !== "undefined") {
        const newWidth = window.innerWidth;
        setScreenWidth(newWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // const safePostsData = Array.isArray(postsData) ? postsData : [];
  return (
    <>
      <MainNav />
      <div className="bg-black pt-20 px-4 md:px-8 pb-8">
        <>
          <div className="flex justify-between items-center mt-6 mb-6">
            <div>
              <h1 className="heading !m-0 text-white">Headlines</h1>
            </div>
            <></>
          </div>

          <div className="z-0 hidden sm:block">
            <Swiper
              spaceBetween={20}
              slidesPerView={
                screenWidth < 640
                  ? 1.2
                  : screenWidth < 768
                  ? 2.2
                  : screenWidth < 1024
                  ? 2.5
                  : 3.2
              }
              modules={[Navigation]}
              navigation={{
                prevEl: ".my-prev-button",
                nextEl: ".my-next-button",
              }}
            >
              {postsData
                .filter((x: any) => x.breaking)
                .map((x: any, index: number) => (
                  <SwiperSlide key={x._id || index}>
                    <div
                      className="border rounded-md cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/v/${x.title
                            .replace(/[^\w\s]/g, "")
                            .split(" ")
                            .join("-")}`
                        )
                      }
                    >
                      <div className="relative image roundedimg overflow-hidden">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: x.imageUrl,
                          }}
                          className="w-full h-60 lg:h-70 object-cover"
                        />

                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-5 text-white p-4 z-50">
                          <div className="">{x.title}</div>
                          <div className="flex justify-between text-xs">
                            <div className="mt-1 text-gray-400">
                              {new Date(x.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                            <div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}

              <div className="uppercase flex space-x-4 hidden sm:inline-block mt-10">
                <button className="my-prev-button rounded-lg border border-black p-1 border border-gray-500 text-gray-500">
                  <ChevronLeft />
                </button>
                <button className="my-next-button rounded-lg border border-black p-1 border border-gray-500 text-gray-500">
                  <ChevronRight />
                </button>
              </div>
            </Swiper>
          </div>

          <div className="sm:hidden space-y-8">
            {postsData
              .filter((x: any) => x.breaking)
              .map((x: any, index: number) => (
                <div className="lg:hidden" key={x._id || index}>
                  <div
                    className="border rounded-md cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/v/${x.title
                          .replace(/[^\w\s]/g, "")
                          .split(" ")
                          .join("-")}`
                      )
                    }
                  >
                    <div className="relative image roundedimg overflow-hidden">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: x.imageUrl,
                        }}
                        className="w-full h-60 lg:h-70 object-cover"
                      />

                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-5 text-white p-4 z-50">
                        <div className="">{x.title}</div>
                        <div className="flex">
                          <div className="text-xs mt-1 text-gray-400">
                            {new Date(x.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      </div>
      <div className="px-4 md:px-8 mx-auto pt-18 pb-20 lg:pb-40">
        {/*  */}

        <div className="mt-10 lg:mt-20 grid grid-cols-1 lg:grid-cols-12 lg:space-x-10">
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

export default MainPageClient;
