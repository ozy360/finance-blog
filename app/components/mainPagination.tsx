"use client";
import { useState, useEffect } from "react";
import { Button } from "@radix-ui/themes";
import { FC } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface MainPaginationProps {
  postsData: String[];
  onCurrentItemsChange: (currentItems: String[]) => void;
}

const MainPagination: FC<MainPaginationProps> = ({
  postsData,
  onCurrentItemsChange,
}) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Display at least 12 items as requested
  const totalPages = Math.ceil(postsData.length / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(postsData)
    ? postsData.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  // Next page function
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Previous page function
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    onCurrentItemsChange(currentItems);
  }, [currentPage, postsData]);

  return (
    <div>
      <div className="flex justify-between">
        <div className="hidden lg:inline-block"></div>
        <div className="flex space-x-4 mt-20">
          <div>
            <Button
              variant="surface"
              size="3"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              <ArrowLeft size={20} strokeWidth={1.4} />
            </Button>
          </div>
          <div>
            <Button
              variant="surface"
              size="3"
              onClick={nextPage}
              disabled={currentPage === totalPages || !postsData.length}
            >
              Next Page <ArrowRight size={20} strokeWidth={1.4} />
            </Button>
          </div>
        </div>
        <div className="inline-block lg:hidden"></div>
      </div>
    </div>
  );
};

export default MainPagination;
