"use client";
import React, { useEffect, useState } from "react";

export default function PaginationControl({ pageIndex, totalPages, currentPage,setCurrentPage}) {
  const [prevEnableBtn, setPrevEnableBtn] = useState(false);
  const [nextEnableBtn, setNextEnableBtn] = useState(false);

  useEffect(() => {
    currentPage === 1 ? setPrevEnableBtn(true) : setPrevEnableBtn(false);
    currentPage === totalPages ? setNextEnableBtn(true) : setNextEnableBtn(false);
  }, [currentPage]);

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <>
      <div className='flex join align-middle justify-center pt-2'>
        <button className='join-item btn btn-sm ' id='prev' disabled={prevEnableBtn} onClick={handlePrevPage}>
          «
        </button>
        <button className='join-item btn btn-sm' id='current'>
          {currentPage}
        </button>
        <button className='join-item btn btn-sm' id='next' disabled={nextEnableBtn} onClick={handleNextPage}>
          »
        </button>
        <div className='joint-item btn btn-sm'>Of {totalPages}</div>
      </div>
    </>
  );
}
