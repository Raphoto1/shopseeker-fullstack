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

export default function ShopsPack({ mainPath, userId }) {
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
  //set de user
  const [userIdIn, setUserIdIn] = useState(userId);
  const [artistName, setArtistName] = useState("");
  //se inicializan paths antes de iniciar swr
  let filterPathCat = "";
  let filterPathShop = "";
  let searchPath = "";
  let userIdPath = ``;
  //organizar userId
  if (userIdIn === undefined) {
    userIdPath = "";
  } else {
    userIdPath = `&userId=${userIdIn}`;
    const getArtistName = fetch(`/api/user/${userIdIn}`, {
      method: "get",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setArtistName(data.payload.name);
      });
  }

  let basePath = `${mainPath}${pageIndex}${limitPerPage}${sortOption}${searchDef}${filterDef}${userIdPath}`;
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
      <div id='shoptitle' className='flex justify-center'>
        {artistName && <h2 className='text-3xl font-bold drop-shadow-md capitalize p-3'>{artistName}'s Shops</h2>}
      </div>
      <div className='total'>
        <div className='topbar flex flex-wrap align-middle justify-center xl:max-w-screen sm:max-w-fit py-2'>
          <div className='flex justify-center'>
            <SearchBar
              onSearchTerm={handleSearchText}
              onButtonClick={handleSearch}
              onSearchFilter={handleSearchFilter}
              searchTextBack={searchText}
              onHandleEnter={handleSearchEnterKey}
            />
          </div>
          {searchText ? <span>searching for {searchText}</span> : <div></div>}
          <Filters setFilterCategoryComp={setFilterCategory} setFilterShopComp={setFilterShop} />
        </div>
        {totalDocs === 0 ? <span>Nope, there's nothing like {searchText} in here, try a diferent term</span> : <div></div>}
        <GridDesigns designsToSort={allDesigns} />
        <div>
          <PaginationControl totalPages={paginationTotal} pageIndex={pageIndex} currentPage={pageIndex} setCurrentPage={setPageIndex} />
          <SortingComboBtn setLimitPerPageComp={setLimitPerPage} setSortOptionComp={setSortOption} />
        </div>
      </div>
    </>
  );
}
