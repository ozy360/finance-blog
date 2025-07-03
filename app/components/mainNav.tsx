"use client";

import { useRouter, usePathname } from "next/navigation";
import { TextField, Card } from "@radix-ui/themes";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { useState } from "react";

export default function MainNav() {
  const [query, setQuery] = useState<String>();
  const [show, setShow] = useState<Boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  async function handleKeyUpFunc(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!query) return;
      const searchQuery = typeof query === "string" ? query : String(query);

      window.location.replace(`/search/?x=${searchQuery}`);
    }
  }

  return (
    <div>
      <div className="w-full top-0 left-0 bg-white pl-3 pr-4 md:px-8 py-4 w-full border-x-0 border-t-0 border border-b-[#DADADA]">
        <div className="flex justify-between items-center">
          <Link
            href={"/"}
            className="flex items-center gap-x-3 logotext text-3xl font-semibold"
          >
            <Image
              src={"/logo3.png"}
              alt="logo"
              width={60}
              height={60}
              className=""
            />{" "}
            <span className="inline-block">{process.env.NEXT_PUBLIC_NAME}</span>
          </Link>
          {/* <Link
            href={"/"}
            className="logotext text-3xl font-semibold md:hidden"
          >
            {process.env.NEXT_PUBLIC_NAME}
          </Link> */}
          <Card
            className="rounded-md lg:hidden cursor-pointer !p-2 text-gray-500"
            onClick={() => setShow(!show)}
          >
            <Search size={18} strokeWidth={1.8} />
          </Card>
        </div>
        {show && (
          <div className="mt-4">
            {" "}
            <TextField.Root
              variant="surface"
              type="text"
              placeholder="Search"
              onChange={(e) => setQuery(e.target.value)}
              onKeyUp={handleKeyUpFunc}
            />
          </div>
        )}
      </div>
    </div>
  );
}
