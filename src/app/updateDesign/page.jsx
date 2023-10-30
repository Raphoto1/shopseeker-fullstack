"use client";
//imports de app
import { useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
//imports propios
import { categories, shops } from "@/enums/SuperVariables";
import PaginationControl from "@/components/buttons/PaginationControl";
export default function UpdateDesign() {
  //control opciones de fields
  const [idChecked, setIdChecked] = useState(false);
  const [chkEnabled, setChkEnabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectValue, setselectValue] = useState("title");
  //set de paginas
  const [pageIndex, setPageIndex] = useState(1);

  //hanlders
  const handleIdCheck = (e) => {
    const desId = e.target.id;
    setIdChecked(desId);
    setChkEnabled(!chkEnabled);
    setShowModal(!showModal);
  };

  //api requests
  //get designs
  let basePath = `/api/design?page=${pageIndex}`;
  const fetcher = async (...args) => await fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSWR(basePath, fetcher);
  if (error) return <h1>Not designs found</h1>;
  if (isLoading)
    return (
      <div className='flex h-full w-full justify-center content-center'>
        <span className='loading loading-infinity loading-lg' />
      </div>
    );
  const allDesigns = data.payload.docs;
  const totoalDocs = data.payload.totalDocs;
  const paginationTotal = data.payload.totalPages;

  //update request
  const handleSubmitUpdate = async (e) => {
    let form = document.querySelector("form");
    e.preventDefault();
    let formData = new FormData(form);
    console.log(formData);
    let idCaptured = idChecked;
    formData.append("idCaptured", idCaptured);
    let response = await fetch("/api", {
      method: "PUT",
      credentials: "include",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.status);
        if (data.status === 200) {
          alert(`success`);
        }
      });
  };

  return (
    <div>
      <h1 className="relative text-center font-black">Choose a design to update</h1>
      <div className='w-full'>
        <table className='table'>
          <thead>
            <tr>
              <th></th>
              <th>Main Image</th>
              <th>Title</th>
            </tr>
            {allDesigns.map((des) => (
              <tr key={des._id}>
                <th>
                  <input type='checkbox' disabled={idChecked==des._id?false:chkEnabled} className='checkbox' id={des._id} name={des._id} value={des.id} onChange={handleIdCheck} />
                </th>
                <th>
                  <Image src={des.photo} width={100} height={100} alt={des.title} />
                </th>
                <th>{des.title}</th>
                <th>
                  <Link href={`/updateDesign/${idChecked}`} className=''>
                    <button className='btn' disabled={idChecked==des._id?!chkEnabled:true}> Let's Update</button>
                  </Link>
                </th>
              </tr>
            ))}
          </thead>
        </table>
      </div>
      <div>
        <PaginationControl totalPages={paginationTotal} pageIndex={pageIndex} currentPage={pageIndex} setCurrentPage={setPageIndex} />
      </div>
      <Link href={`/updateDesign/${idChecked}`} className='absolute'>
        <button className='btn'> Let's Update</button>
      </Link>
    </div>
  );
}
