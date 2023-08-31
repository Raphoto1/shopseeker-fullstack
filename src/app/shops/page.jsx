"use client";
//imports de app
import useSWR from "swr";
import { useState } from "react";
//imports propios
import CardDesign from "@/components/CardDesign";
import SearchBar from "@/components/navbar/SearchBar";

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

  //se inicializan paths antes de iniciar swr
  let searchPath = "";
  let filterPathCat = "";
  let filterPathShop = "";
  let limitDesigns ="&limit=20"
  let basePath = `/api/design?page=${pageIndex}${limitPerPage}${searchDef}${filterDef}`;
  //se usa swr para manejar el fetch por recomendacion de vercel
  const fetcher = async (...args) => await fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSWR(basePath, fetcher);
  if (error) return <h1>Not designs found</h1>;
  if (isLoading)
    return (
      <div className='flex h-full w-full justify-center content-center'>
        <span className='loading loading-infinity loading-lg' />
      </div>
    );
  //data de paginacion
  const allDesigns = data.payload.docs;
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
  const handleSearch = () => {
    setSearchDef(searchPath);
  };

  const handleSearchFilter = (value) => {
    setSearchKey(value);
  };

  //organizar y captura filter
  const handleCategoryFilter = (e) => {
    setFilterCategory(e.target.value);
  };

  const handleShopFilter = (e) => {
    setFilterShop(e.target.value);
  };

  const handleApplyFilter = () => {
    console.log(filterPathCat, filterPathShop);
    setFilterDef(`${filterPathCat}${filterPathShop}`);
  };

  //organizar y capturar sort
  const handleLimit = (e) => {
    console.log(e.target.value);
    setLimitPerPage(`&limit=${e.target.value}`)
  }

  //captura de like
  
  console.log(limitPerPage);
  return (
    <>
      <div className='total'>
        <div className='topbar flex flex-wrap justify-center w-full sm:max-w-fit'>
          <div className='flex w-full justify-center min-w-full'>
            <SearchBar onSearchTerm={handleSearchText} onButtonClick={handleSearch} onSearchFilter={handleSearchFilter} />
          </div>
          <div className='input-group  justify-center'>
            <span htmlFor='filter' className='btn'>
              Filters
            </span>
            <select name='category' id='categoryFilter' className='select' onChange={handleCategoryFilter}>
              <option disabled selected>
                Filter by Category
              </option>
              <option value='Digital'>Digital</option>
              <option value='Traditional'>Traditional</option>
              <option value='Photography'>Photography</option>
              <option value='MixedMedia'>MixedMedia</option>
            </select>
            <select name='shops' id='shopsFilter' className='select' onChange={handleShopFilter}>
              <option disabled selected>
                Filter by Shop
              </option>
              <option value='RedBubble'>RedBubble</option>
              <option value='Society6'>Society6</option>
              <option value='Displate'>Displate</option>
              <option value='TeePublic'>TeePublic</option>
              <option value='Spreadshirt'>Spreadshirt</option>
            </select>
            <button className='btn' onClick={handleApplyFilter}>
              Apply Filter
            </button>
          </div>
        </div>
        <div className='grid grid-flow-row md:grid-cols-4 sm:grid-cols-1 gap-2 pt-2'>
          {allDesigns.map((des) => (
            <div key={des._id}>
              <CardDesign
                key={des._id}
                id={des._id}
                title={des.title}
                description={des.description}
                category={des.category}
                photo={des.photo}
                shops={des.shops}
                likes={des.likes}
              />
            </div>
          ))}
        </div>

        <div>
          <div className='flex join align-middle justify-center pt-2'>
            <button className='join-item btn' onClick={() => setPageIndex(pageIndex - 1)}>
              «
            </button>
            <button className='join-item btn'>{pageIndex}</button>
            <button className='join-item btn' onClick={() => setPageIndex(pageIndex + 1)}>
              »
            </button>
            <div className='btn'>Of {paginationTotal}</div>
          </div>
          <div className='sort'>
            <div id="limitselect" className="join">
              <label className="btn join-item">Designs per page</label>
              <select name="limit" id="" className="select join-item" onChange={handleLimit}>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div id="sortSelect">

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
