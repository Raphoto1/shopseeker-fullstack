"use client";
//imports de app
import useSWR from "swr";
import { useState, useEffect } from "react";
//imports propios
import SearchBar from "@/components/navbar/SearchBar";
import PaginationControl from "@/components/buttons/PaginationControl";
import SortingComboBtn from "@/components/buttons/SortingComboBtn";
import GridDesigns from "@/components/GridDesigns";
import Filters from "@/components/navbar/Filters";

export default function Shops() {
  //set de paginas
  const [pageIndex, setPageIndex] = useState(1);
  const [searchText, setSearchText] = useState("");
  //set de busquedas
  const [searchDef, setSearchDef] = useState("");
  const [searchKey, setSearchKey] = useState("");
  //set de filtros
  const [filterCategory, setFilterCategory] = useState("");
  const [filterShop, setFilterShop] = useState("");
  const [filterDef, setFilterDef] = useState("");
  //set de sorts
  const [limitPerPage, setLimitPerPage] = useState("&limit=20");
  const [sortOption, setSortOption] = useState("&sortQ=1");

  //se inicializan paths antes de iniciar swr
  let filterPathCat = "";
  let filterPathShop = "";
  let searchPath = "";
  let basePath = `/api/design?page=${pageIndex}${limitPerPage}${sortOption}${searchDef}${filterDef}`;
  //useEffect para aplicar filtros
  useEffect(() => {
    setFilterDef(`${filterPathCat}${filterPathShop}`);
  }, [filterCategory, filterShop, searchDef]);

  //se usa swr para manejar el fetch por recomendacion de vercel
  const fetcher = async (...args) => await fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSWR(basePath, fetcher);
  if (error) return <h1>opps, my bad, try reloading :D</h1>;
  if (isLoading)
    return (
      <div className='flex h-full w-full justify-center content-center'>
        <span className='loading loading-infinity loading-lg' />
      </div>
    );

  //data de paginacion
  const allDesigns = data.payload.docs;
  const totalDocs = data.payload.totalDocs;
  const paginationTotal = data.payload.totalPages;

  //organizar ruta search
  if (searchText === "") {
    searchPath = "";
  } else {
    searchPath = `&search=${searchText}&queryKey=${searchKey}`;
  }

  //organizar ruta filter
  filterCategory ? (filterPathCat = `&filterCat=${filterCategory}`) : (filterPathCat = "");
  filterShop ? (filterPathShop = `&filterShop=${filterShop}`) : (filterPathShop = "");

  //organizar y capturar busqueda
  const handleSearchText = (value) => {
    setSearchText(value);
  };

  const handleSearchEnterKey = (e) => {
    if (e === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    setSearchDef(searchPath);
  };

  const handleSearchFilter = (value) => {
    setSearchKey(value);
  };

  return (
    <>
      <div className='total'>
        <div className='topbar flex flex-wrap align-middle justify-center justify-items-center xl:max-w-screen sm:max-w-fit py-2'>
          <div className='flex justify-center'>
            <SearchBar
              onSearchTerm={handleSearchText}
              onButtonClick={handleSearch}
              onSearchFilter={handleSearchFilter}
              searchTextBack={searchText}
              onHandleEnter={handleSearchEnterKey}
            />
          </div>
          {searchText ? <span>searching for {searchText}</span> : <></>}
          <Filters setFilterCategoryComp={setFilterCategory} setFilterShopComp={setFilterShop} className='align-center justify-center' />
        </div>
        {totalDocs === 0 ? <span>Nope, there's nothing like {searchText} in here, try a diferent term</span> : <></>}
        <GridDesigns designsToSort={allDesigns} />
        <div>
          <PaginationControl totalPages={paginationTotal} pageIndex={pageIndex} currentPage={pageIndex} setCurrentPage={setPageIndex} />
          <SortingComboBtn setLimitPerPageComp={setLimitPerPage} setSortOptionComp={setSortOption} />
        </div>
      </div>
    </>
  );
}
