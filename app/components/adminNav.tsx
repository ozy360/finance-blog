"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button, Text } from "@radix-ui/themes";
import { CornerUpRight, Plus } from "lucide-react";

interface ChildComponentProps {
  openDialog: () => void;
}

export default function AdminNav({ openDialog }: ChildComponentProps) {
  const router = useRouter();
  const pathname = usePathname();

  async function logout() {
    try {
      await fetch("/api/auth/logout");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
    }
  }
  return (
    <div>
      <div className="w-full top-0 left-0 bg-[#1d1d1b]">
        <div className="flex justify-between items-center px-4 md:px-8 py-3 bg-1 w-full">
          <div className="flex gap-x-4 items-center text-[#fffc] color-[#fffc]">
            <div className="logotext text-xl font-medium">Admin</div>
            <span> | </span>
            <div className="text-sm">
              <Link href="/admin">Post</Link>
            </div>
            <div className="text-sm">
              <Link href="/admin/images">Images</Link>
            </div>
          </div>
          <div className="flex space-x-4 items-center uppercase">
            <div className="flex gap-x-2 items-center">
              <div>
                {pathname === "/admin/images" && (
                  <Button size="1" variant="surface" onClick={openDialog}>
                    Add image
                    <Plus size={15} />
                  </Button>
                )}

                {pathname === "/admin" && (
                  <Button size="1" variant="surface" onClick={openDialog}>
                    Add post
                    <Plus size={15} />
                  </Button>
                )}
              </div>

              <Button size="1" variant="surface" onClick={logout}>
                <CornerUpRight size={15} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
