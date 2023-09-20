"use client";
//imports de app
import { useState } from "react";
import useSWR from "swr";
//imports propios
import { categories, shops } from "@/enums/SuperVariables";

export default function UpdateDesign() {
  //control opciones de fields
  const [isShopsOn, setShopsOn] = useState(false);
  const [isPhotoOn, setPhotoOn] = useState(false);
  const [isCategoryOn, setCategoryOn] = useState(false);
  const [idChecked, setIdChecked] = useState(false);
  const [selectValue, setselectValue] = useState("title");

  //hanlders
  const handleIdCheck = (id) => {
    setIdChecked(id);
}

  const handlePhoto = () => {
    setPhotoOn(!isPhotoOn);
  };

  const handleShops = () => {
    setShopsOn(!isShopsOn);
  };

  const handleCategory = () => {
    setCategoryOn(!isCategoryOn);
  };

  //api requests
  //get designs
  let basePath = `/api/design`;
  const fetcher = async (...args) => await fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSWR(basePath, fetcher);
  if (error) return <h1>Not designs found</h1>;
  if (isLoading) return <h1>Loading...</h1>;
  const allDesigns = data.payload.docs;
  //update request
  const handleSubmitUpdate = async (e) => {
    
    let form = document.querySelector("form");
    e.preventDefault();
    let formData = new FormData(form);
    console.log(formData);
    let idCaptured = 'test de un captured'
    formData.append("idCaptured",idCaptured);
    let response = await fetch("/api/design", {
      method: "PUT",
      credentials: "include",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.status);
        if (data.status===200) {
          alert(`success`)
        }
      });
  };

  return (
    <div>
      <h1>update design</h1>
      <h2>list of designs</h2>
      <div className='overflow-x-auto'>
        <table className='table'>
          <thead>
            <tr>
              <th>
                <label htmlFor="">
                  <input type="checkbox" className="checkbox" name="" id="" />
                </label>
              </th>
              <th>Id</th>
              <th>Title</th>
            </tr>
            {allDesigns.map((des) => (
              <tr key={des._id}>
                <th>
                  <input type="checkbox" className="checkbox" name={des._id} value={des.id} isSelected={idChecked} onValueChange={setIdChecked} />
                </th>
                <th>{des._id}</th>
                <th>{ des.title}</th>
              </tr>
            ))}
          </thead>
        </table>
      </div>

      <div className='flex items-center justify-center pt-5'>
        <div className='flex items-center justify-center border-4 rounded-lg w-fit h-fit px-5 py-5'>
          <form onSubmit={handleSubmitUpdate} className='flex flex-col space-y-1'>
            <label for='id'>design Id</label>
            <input type='text' name='id' className='dark:text-gray-900' />
            <br />
            <label for='field'>field to update</label>
            <select
              name='field'
              id='valueSelect'
              onChange={(e) => {
                if (e.target.value === "shops") {
                  handleShops();
                  setPhotoOn(false);
                  setCategoryOn(false);
                } else if (e.target.value === "photo") {
                  handlePhoto();
                  setShopsOn(false);
                  setCategoryOn(false);
                } else if (e.target.value === "category") {
                  handleCategory();
                  setPhotoOn(false);
                  setShopsOn(false);
                } else {
                  setShopsOn(false);
                  setPhotoOn(false);
                  setCategoryOn(false);
                }
              }}
              className='dark:text-gray-900'>
              <option value='title' selected>
                title
              </option>
              <option value='description'>description</option>
              <option value='category'>category</option>
              <option value='price'>price</option>
              <option value='stock'>stock</option>
              <option value='photo'>photo</option>
              <option value='shops'>shops</option>
            </select>
            {isShopsOn && (
              <div>
                <h1>choose the shop url to Update</h1>
                <select name='data' id='shop' className='dark:text-gray-900'>
                {shops.map((shop,index) => (
                <option value={shop} key={index}>{ shop}</option>  
              ))}
                </select>
                <div>
                  <label htmlFor='url'>New Url</label>
                  <br />
                  <input type='text' name='url' id='url' className='dark:text-gray-900' />
                </div>
              </div>
            )}
            {isPhotoOn && (
              <div>
                <input type='file' name='photo' id='photo' />
              </div>
            )}
            {isCategoryOn && (
              <div>
                <select name='data' id='category'>
                {categories.map((cat,index) => (
                <option value={cat} key={index}>{ cat}</option>  
              ))}
                </select>
              </div>
            )}
            <br />
            {!isPhotoOn && !isShopsOn && !isCategoryOn && (
              <div>
                <label for='data'> new value</label>
                <div id='dataContainer'>
                  <input type='text' name='data' id='data' className='dark:text-gray-900' />
                </div>
              </div>
            )}
            <br />
            <input type='submit' />
          </form>
        </div>
      </div>
    </div>
  );
}
