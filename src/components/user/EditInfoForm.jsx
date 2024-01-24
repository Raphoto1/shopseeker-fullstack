"use client";
//imports de app
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
//imports Propios
import DnDSpaceSingle from "../extras/DnDSpaceSingle";
export default function EditInfoForm(props) {
  const router = useRouter()
  const [files, setFiles] = useState([]);
  const userId = props.userId;

  const modalController = () => {
    document.getElementById("editInfoModal").showModal();
  };

  const handleSubmit = () => {
    const url = `/api/user/${userId}`;
    let form = document.getElementById("editInfoForm");
    let formData = new FormData(form);
    files.forEach((file)=> formData.append('photo',file))
    const result = fetch(url, {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast(`Error Updating User, Try Again${data.error}`);
        } else {
          toast("Succesfully Updated");
          router.refresh();
        }
      });
  };
  return (
    <>
      <button className='btn' onClick={modalController}>
        Edit Info
      </button>
      <dialog id='editInfoModal' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box flex align-middle justify-center'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
          </form>
          <div>
            <h3 className='font-bold text-lg'>Edit Your Personal Info</h3>
            <div>
              <form onSubmit={handleSubmit} id='editInfoForm'>
                <div className='pb-2'>
                  <label htmlFor='name'>Name</label>
                  <input type='text' name='name' className='input input-bordered w-full' />
                </div>
                <div className='pb-2'>
                  <label htmlFor='lastName'>Last Name</label>
                  <input type='text' name='lastName' className='input input-bordered w-full' />
                </div>
                <div className='pb-2'>
                  <label htmlFor='age'>Age</label>
                  <input type='number' name='age' className='input input-bordered w-full' />
                </div>
                <div className='avatarImageDrop'>
                  <h2 className='block text-center'>Avatar Image</h2>
                  <DnDSpaceSingle files={files} setFiles={setFiles} />
                </div>
                <div className='pb-2'>
                  <label htmlFor='description'>About</label>
                  <textarea name='description' cols='20' rows='5' placeholder='Share About You' className='textarea textarea-bordered w-full' />
                </div>
                <div className='pb-2'>
                  <button className='btn' type='submit'>
                    Update Info
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
