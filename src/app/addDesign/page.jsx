"use client";

import { useState } from "react";

export default function Upload() {
  "use client"
  //control botones tienda
  const [isCheckedRed, setCheckedRed] = useState(false);
  const [isCheckedSoc, setisCheckedSoc] = useState(false);
  const [isCheckedDis, setisCheckedDis] = useState(false);
  const [isCheckedTee, setisCheckedTee] = useState(false);
  const [isCheckedSpread, setisCheckedSpread] = useState(false);
  const handleRed = () => {
    setCheckedRed(!isCheckedRed);
  };

  const handleSoc = () => {
    setisCheckedSoc(!isCheckedSoc);
  };

  const handleDis = () => {
    setisCheckedDis(!isCheckedDis);
  };

  const handleTee = () => {
    setisCheckedTee(!isCheckedTee);
  };

  const handleSpread = () => {
    setisCheckedSpread(!isCheckedSpread);
  };
  //control de form
  
  const handleSubmit = async (e) => {
    let form = document.querySelector("form");
    e.preventDefault();
    let formData = new FormData(form);
    let response = await fetch("/api/design", {
      method: "POST",
      credentials: "include",
      body: formData,
    }).then((res) => res.json())
    .then((data) => console.log(data))
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
            <select name="category" id="category">
              <option value="Digital">Digital</option>
              <option value="Traditional">Traditional</option>
              <option value="Photography">Photography</option>
              <option value="MixedMedia">MixedMedia</option>
            </select>
          </div>
          <h2>Shops</h2>
          <div>
            <div>
              <label className='relative inline-flex items-center mb-4 cursor-pointer'>
                <input type='checkbox' value='' className='sr-only peer' checked={isCheckedRed} onChange={handleRed} />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className='ml-3 text-sm font-medium text-gray-900 dark:text-gray-300'>RedBubble</span>
              </label>
              {isCheckedRed && (
                <div>
                  <label htmlFor='urlRed' className='pr-3'>
                    URL de RedBubble
                  </label>
                  <input type='text' id='urlRed' name='urlRed' className='rounded-xl text-slate-900' />
                </div>
              )}
            </div>

            <div>
              <label className='relative inline-flex items-center mb-4 cursor-pointer'>
                <input type='checkbox' value='' className='sr-only peer' checked={isCheckedSoc} onChange={handleSoc} />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className='ml-3 text-sm font-medium text-gray-900 dark:text-gray-300'>Society6</span>
              </label>
              {isCheckedSoc && (
                <div>
                  <label htmlFor='urSoc' className='pr-3'>
                    URL de Society 6
                  </label>
                  <input type='text' id='urlSoc' name='urlSoc' className='rounded-xl text-slate-900' />
                </div>
              )}
            </div>

            <div>
              <label className='relative inline-flex items-center mb-4 cursor-pointer'>
                <input type='checkbox' value={() => console.log(value)} className='sr-only peer' checked={isCheckedDis} onChange={handleDis} />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className='ml-3 text-sm font-medium text-gray-900 dark:text-gray-300'>Displate</span>
              </label>
              {isCheckedDis && (
                <div>
                  <label htmlFor='urlDisp' className='pr-3'>
                    URL de Displate
                  </label>
                  <input type='text' id='urlDisp' name='urlDisp' className='rounded-xl text-slate-900' />
                </div>
              )}
            </div>

            <div>
              <label className='relative inline-flex items-center mb-4 cursor-pointer'>
                <input type='checkbox' value='' className='sr-only peer' checked={isCheckedTee} onChange={handleTee} />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className='ml-3 text-sm font-medium text-gray-900 dark:text-gray-300'>Teepublic</span>
              </label>
              {isCheckedTee && (
                <div>
                  <label htmlFor='urlTee' className='pr-3'>
                    URL de TeePublic
                  </label>
                  <input type='text' id='urlTee' name='urlTee' className='rounded-xl text-slate-900' />
                </div>
              )}
            </div>
            <div>
              <label className='relative inline-flex items-center mb-4 cursor-pointer'>
                <input type='checkbox' value='' className='sr-only peer' checked={isCheckedSpread} onChange={handleSpread} />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className='ml-3 text-sm font-medium text-gray-900 dark:text-gray-300'>Spread Shirt</span>
              </label>
              {isCheckedSpread && (
                <div>
                  <label htmlFor='urlSpre' className='pr-3'>
                    URL de Spread Shirt
                  </label>
                  <input type='text' id='urlSpre' name='urlSpre' className='rounded-xl text-slate-900' />
                </div>
              )}
            </div>
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
              class='text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>
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
