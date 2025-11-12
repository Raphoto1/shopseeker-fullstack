"use client";
//imports de app
import { toast } from "react-toastify";
//imports propios
import { getContactPath } from "@/enums/SuperVariables";

export default function ContactForm() {
  const modalController = () => {
    document.getElementById("contactModal").showModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let form = document.getElementById("contactForm");
    let formData = new FormData(form);
    let response = await fetch(getContactPath(), {
      method: 'post',
      credentials: 'include',
      body:formData
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert('error contacting, please try again') 
        } else {
          toast('Successfully Contacted to CreativeRafa'); 
          document.getElementById("contactModal").close();
        }
    })
  }

  return (
    <>
      
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button className='btn' onClick={modalController}>
        Let's Talk(Contact me)
      </button>
      <dialog id='contactModal' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box flex align-middle justify-center'>
          <form method='dialog' >
            {/* if there is a button in form, it will close the modal */}
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
          </form>
          <div className="">
            <h3 className='font-bold text-lg'>Hey there, let's talk</h3>
            <div>
              <form onSubmit={handleSubmit} id="contactForm" className="">
                <div className="pb-2">
                  <label htmlFor="name">Name</label>
                  <input type="text" name="name" className="input input-bordered w-full"/>
                </div>
                <div className="pb-2">
                  <label htmlFor="email">E-mail</label>
                  <input type="email" name="email" className="input input-bordered w-full"/>
                </div>
                <div>
                  <textarea name="message" id="message" cols="30" rows="10" placeholder="How can I help you?" className="textarea textarea-bordered w-full"></textarea>
                </div>
                <button className="btn" type="submit">Send</button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
