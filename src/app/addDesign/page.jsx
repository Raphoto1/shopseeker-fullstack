"use client";
//imports de app
import { useState } from "react";
//imports propios
import { categories, shops } from "@/enums/SuperVariables";
import HiddenInput from "@/components/extras/HiddenInput";

export default function Upload() {
  //control de form

  const handleSubmit = async (e) => {
    let form = document.querySelector("form");
    e.preventDefault();
    let formData = new FormData(form);
    let response = await fetch("/api/design", {
      method: "POST",
      credentials: "include",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        data.error ? alert("error Loading design") : alert("uploaded successfully");
      });
  };

  return (
    <div className='flex items-center justify-center pt-5'>
      <div className='flex items-center justify-center border-4 rounded-lg w-fit h-fit px-5 py-5'>
        <form onSubmit={handleSubmit} className='flex flex-col space-y-1'>
          <div className='flex flex-col space-y-1'>
            <label htmlFor='pCode'>Personal Code</label>
            <input type='text' id='pCode' name='pCode' className='rounded-lg text-slate-900' />
          </div>
          <div className='flex flex-col space-y-1'>
            <label htmlFor='title'>Title</label>
            <input type='text' id='title' name='title' className='rounded-lg text-slate-900' />
          </div>
          <div className='flex flex-col space-y-1'>
            <label htmlFor='description'>Description</label>
            <input type='text' id='description' name='description' className='rounded-lg text-slate-900' />
            <label htmlFor='Technique'>Technique</label>
            <select name='category' id='category'>
              {categories.map((cat, index) => (
                <option value={cat} key={index}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <h2>Shops</h2>
          <div>
            {shops.map((shop, index) => (
              <HiddenInput shopName={shop} key={index} />
            ))}
          </div>
          <div className='flex justify-center'>
            <input
              type='file'
              name='photo'
              id='photo'
              className="'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'"
            />
            {/* <button
              type='file'
              class='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>
              Upload Main Image
            </button> */}
            <button
              type='button'
              className='text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>
              Upload Secondary Images(future dev)
            </button>
          </div>
          <button
            type='submit'
            class='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>
            Add Design
          </button>
        </form>
      </div>
    </div>
  );
}
