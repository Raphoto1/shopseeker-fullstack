"use client";
//imports de app
import { useState } from "react";

export default function UpdateDesign() {
  //control opciones de shops
  const [isShopsOn, setShopsOn] = useState(false);
  const [isPhotoOn, setPhotoOn] = useState(false);
  const [selectValue, setselectValue] = useState("title");

  const handlePhoto = () => {
    console.log("llegue a photos");
    setPhotoOn(!isPhotoOn);
  };

  const handleShops = () => {
    console.log("llegue a handle");
    setShopsOn(!isShopsOn);
  };

  const handleSubmitUpdate = async (e) => {
    let form = document.querySelector("form");
    e.preventDefault();
    let formData = new FormData(form);
    let response = await fetch("/api/design", {
      method: "PUT",
      credentials: "include",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  return (
    <div>
      <h1>update design</h1>

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
                } else if (e.target.value === "photo") {
                  handlePhoto();
                  setShopsOn(false);
                } else {
                  setShopsOn(false);
                  setPhotoOn(false);
                }
                // setselectValue(e.target.value);
                // console.log(selectValue);
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
                  <option value='RedBubble' selected>
                    RedBubble
                  </option>
                  <option value='Society6'>Society6</option>
                  <option value='Displate'>Displate</option>
                  <option value='TeePublic'>TeePublic</option>
                  <option value='Spreadshirt'>Spreadshirt</option>
                </select>
                <div>
                  <label htmlFor="url">New Url</label>
                  <br />
                  <input type="text" name="url" id="url" className="dark:text-gray-900"/>
                </div>
              </div>
            )}
            {isPhotoOn && (
              <div>
                <input type="file" name="photo" id="photo" />
              </div>
            )}
            <br />
            {(!isPhotoOn && !isShopsOn) &&(
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
