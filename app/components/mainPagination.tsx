"use client";
import { useState, useEffect } from "react";
import { Button } from "@radix-ui/themes";
import { FC } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface MainPaginationProps {
  postsData: string[];
  onCurrentItemsChange: (currentItems: string[]) => void;
  uid: string;
}

const MainPagination: FC<MainPaginationProps> = ({
  postsData,
  onCurrentItemsChange,
  uid,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Step 1: Filter postsData if uid exists
  const decodedUid = decodeURIComponent(uid || "");
  const filteredPostsData = uid
    ? postsData.filter((x: any) =>
        x.tags
          .split(",")
          .map((tag: any) => tag.trim())
          .includes(decodedUid)
      )
    : postsData;

  // Step 2: Paginate the filtered posts
  const totalPages = Math.ceil(filteredPostsData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPostsData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Update current items on change
  useEffect(() => {
    onCurrentItemsChange(currentItems);
  }, [currentPage, postsData, uid]);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="hidden lg:inline-block"></div>
        <div className="flex gap-x-4 mt-20">
          <Button
            variant="surface"
            size="3"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            <ArrowLeft size={20} strokeWidth={1.4} />
          </Button>
          <Button
            variant="surface"
            size="3"
            onClick={nextPage}
            disabled={currentPage === totalPages || !filteredPostsData.length}
          >
            Next Page <ArrowRight size={20} strokeWidth={1.4} />
          </Button>
        </div>
        <div className="inline-block lg:hidden"></div>
      </div>
    </div>
  );
};

export default MainPagination;
