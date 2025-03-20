"use client";
import { useState } from "react";
import { BsSearch } from "react-icons/bs";
export default function SearchBar({ onSearchTerm, onButtonClick, onSearchFilter, searchTextBack, onHandleEnter }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    onSearchTerm(event.target.value);
  };
  //filter
  const handleFilter = (e) => {
    setSearchFilter(e.target.value);
    onSearchFilter(e.target.value);
  };
  const handleEnter = (e) => {
    onHandleEnter(e.key)
  }

  return (
    <>
      <div className='form-control '>
        <div className='join join-horizontal'>
          <input type='text' onChange={handleSearch} onKeyDown={handleEnter} placeholder='Search…' className='input-sm input-bordered join-item w-40' />
          <select className='select-sm input-bordered join-item' onChange={handleFilter} onSelect={onSearchFilter} id='filter' name='filter'>
            <option selected value='title'>
              title
            </option>
            <option value='description'>description</option>
          </select>

          <button className='btn btn-sm join-item' onClick={onButtonClick} onKeyDown={handleEnter} >
            <BsSearch />
          </button>
        </div>
      </div>
    </>
  );
}
