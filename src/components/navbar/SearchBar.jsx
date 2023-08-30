"use client";
import { useState } from "react";
export default function SearchBar({ onSearchTerm, onButtonClick, onSearchFilter }) {
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

  return (
    <>
      <div className='form-control '>
        <div className='join join-horizontal'>
          <input type='text' onChange={handleSearch} placeholder='Search…' className='input input-bordered join-item' />
          <select className='select input-bordered join-item' onChange={handleFilter} onSelect={onSearchFilter} id='filter' name='filter'>
            <option selected value='title'>
              title
            </option>
            <option value='description'>description</option>
            <option value='test'>test</option>
          </select>
          <div className="indicator">
            <button className='btn join-item' onClick={onButtonClick}>
              <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
