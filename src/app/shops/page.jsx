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
  const [searchDef, setSearchDef] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterShop, setFilterShop] = useState("");
  const [filterDef, setFilterDef] = useState("");
  //se inicializan paths antes de iniciar swr
  let searchPath = '';
  let filterPathCat = '';
  let filterPathShop = '';
  let basePath = `/api/design?page=${pageIndex}&limit=20${searchDef}${filterDef}`;
  //se usa swr para manejar el fetch por recomendacion de vercel
  const fetcher = async (...args) => await fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSWR(basePath, fetcher);
  if (error) return <h1>Not designs found</h1>;
  if (isLoading) return <h1>Loading...</h1>;
  //data de paginacion
  const allDesigns = data.payload.docs;
  const paginationTotal = data.payload.totalPages;
  //organizar ruta search
  if (searchText === "") {
    searchPath = "";
  } else {
    searchPath = `&search=${searchText}&queryKey=${searchKey}`;
  };

//organizar ruta filter
  filterCategory? filterPathCat = `&filterCat=${filterCategory}` : filterPathCat = "";
  filterShop? filterPathShop = `&filterShop=${filterShop}` : filterPathShop = "";
  // if (filterCategory && filterShop ==="") {
  //   filterPathCat = ""
  //   filterPathShop =""
  // } else {
  //   filterPathShop = `&filterShop=${filterShop}`;
  //   filterPathCat = `&filterCat=${filterCategory}`;
  // };

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
  }
  console.log(filterCategory);
  console.log(filterPathShop);
  console.log(filterDef);
  return (
    <>
      <div className=''>
        <div className='flex content-center  '>
          <SearchBar onSearchTerm={handleSearchText} onButtonClick={handleSearch} onSearchFilter={handleSearchFilter} />
        </div>
        <div className='input-group'>
          <span htmlFor='filter'>Filters</span>
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
          <button className="btn btn-square" onClick={handleApplyFilter}>Apply Filter</button>
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
              />
            </div>
          ))}
        </div>

        <div>
          <button onClick={() => setPageIndex(pageIndex - 1)}>previous page</button>
          <h1>{pageIndex}</h1>
          <button onClick={() => setPageIndex(pageIndex + 1)}>Next Page</button>
          <h2>total pages {paginationTotal}</h2>
        </div>
      </div>
    </>
  );
}
