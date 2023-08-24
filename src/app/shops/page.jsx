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
  const [searchText, setSearchText] = useState('');
  const [searchDef, setSearchDef] = useState('');
  const [searchKey, setSearchKey] = useState('');
  //se inicializan paths antes de iniciar swr
  let basePath = `/api/design?page=${pageIndex}&limit=20${searchDef}`
  let searchPath = ``
  //se usa swr para manejar el fetch por recomendacion de vercel
  const fetcher = async (...args) => await fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSWR(basePath, fetcher);
  if (error) return console.log("falla del fetch");
  if (isLoading) return <h1>Loading...</h1>;
  //data de paginacion
  const allDesigns = data.payload.docs;
  const paginationTotal = data.payload.totalPages;
  //organizar ruta  
  if (searchText==='') {
    searchPath=''
  } else {
    searchPath = `&search=${searchText}`
  }
  
  //organizar y capturar busqueda
  const handleSearchText = (value) => {
    setSearchText(value);
  }
  const handleSearch = () => {
    setSearchDef(searchPath);
  }

  return (
    <>
      <div className="">
        <div className="flex content-center  ">
          <SearchBar onSearchTerm={handleSearchText} onButtonClick={handleSearch} />
          <h2>filters</h2>
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
