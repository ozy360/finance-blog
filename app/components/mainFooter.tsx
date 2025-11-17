"use client";
import Image from "next/image";

export default function MainFooter() {
  return (
    <>
      <div className="flex flex-col sm:flex-row items-center text-center sm:text-right justify-between p-4 md:px-8 text-base bg-black text-[#d9d9d9] space-y-5">
        <Image
          src={"/logo3.png"}
          alt="logo"
          width={80}
          height={80}
          className=""
        />{" "}
        <div className="space-y-1 text-sm">
          <div>support@businesstrends.com</div>
          {/* <div><Instagram /> <Twitter /></div> */}
          <div className="text-gray-500">
            &copy; {new Date().getFullYear()} {process.env.NEXT_PUBLIC_NAME}
          </div>
        </div>
      </div>
    </>
  );
}
