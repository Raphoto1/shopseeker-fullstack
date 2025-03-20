"use client";
//imports de app
import { useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
//imports propios
import { categories, shops } from "@/enums/SuperVariables";
import PaginationControl from "@/components/buttons/PaginationControl";
export default function DesignManager(props) {
  const router = useRouter();
  //control opciones de fields
  const [idChecked, setIdChecked] = useState(false);
  const [chkEnabled, setChkEnabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [desName, setDesName] = useState("");
  const [selectValue, setselectValue] = useState("title");
  const [userId, setUserId] = useState(props.uId);

  let userPath = "";

  if (userId === undefined) {
    userPath = "";
  } else {
    userPath = `&userId=${userId}`;
  }
  //set de paginas
  const [pageIndex, setPageIndex] = useState(1);

  //hanlders
  const handleIdCheck = (e) => {
    const desId = e.target.id;
    const desNameIn = e.target.name;
    setDesName(desNameIn);
    setIdChecked(desId);
    setChkEnabled(!chkEnabled);
    setShowModal(!showModal);
  };

  const handleDelete = (e) => {
    if (confirm(`Design ${desName} will be DELETED`)) {
      applyDelete();
    } else {
      alert("canceled");
    }
  };

  const applyDelete = async () => {
    const result = await fetch(`/api/design/${idChecked}`, {
      method: "delete",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("Error ocurred deleting design");
        } else {
          alert("Design Deleted");
          setDesName(false);
          setIdChecked(false);
          setChkEnabled(!chkEnabled);
          setShowModal(!showModal);
          router.refresh();
        }
      });
  };
  //api requests
  //get designs
  let basePath = `/api/design?page=${pageIndex}${userPath}`;
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

  return (
    <div>
      <h1 className='relative text-center font-black'>Choose a design to update</h1>
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
                  <input
                    type='checkbox'
                    disabled={idChecked == des._id ? false : chkEnabled}
                    className='checkbox'
                    id={des._id}
                    name={des.title}
                    value={des.id}
                    onChange={handleIdCheck}
                  />
                </th>
                <th>
                  <Image src={des.photo} width={100} height={100} alt={des.title} />
                </th>
                <th>{des.title}</th>
                <th>
                  <Link href={`/updateDesign/${idChecked}`} className='p-2'>
                    <button className='btn' disabled={idChecked == des._id ? !chkEnabled : true}>
                      {" "}
                      Let's Update
                    </button>
                  </Link>
                  <button onClick={handleDelete} disabled={idChecked == des._id ? !chkEnabled : true} className='btn btn-error'>
                    Delete Design
                  </button>
                </th>
              </tr>
            ))}
          </thead>
        </table>
      </div>
      <div>
        <PaginationControl totalPages={paginationTotal} pageIndex={pageIndex} currentPage={pageIndex} setCurrentPage={setPageIndex} />
      </div>
    </div>
  );
}
