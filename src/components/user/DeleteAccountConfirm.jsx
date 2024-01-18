"use client";
//imports de app
import { useRouter } from "next/navigation";

export default function DeleteAccountConfirm({ tokenIn }) {
  const router = useRouter();

    const handleDeleteAccount = (e) => {
        e.preventDefault();
        let form = document.getElementById('deleteConfirmForm');
        let formData = new FormData(form);
        formData.append('token', tokenIn);
        let url = '/api/user/'
        const result = fetch(url, {
            method: 'Delete',
            credentials: 'include',
            body:formData,
        })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
              alert("successfully Deleted");
              //revisar signout
            router.push("/auth");
          } else {
            alert("Error Deleting");
          }
        });
  };

  return (
    <>
      <h3 className='flex justify-center text-center text-lg title capitalize'>YOU ARE ABOUT TO DELETE YOUR ACCOUNT AND ALL DESIGNS SAVED OR UPLOADED</h3>
      <form onSubmit={handleDeleteAccount} className="px-10" id="deleteConfirmForm">
        <div className='pb-2'>
          <label htmlFor='email'>Confirm your Email</label>
          <input type='email' name='email' required className='input input-bordered w-full' />
        </div>
        <div className='pb-2'>
          <label htmlFor='password'>Confirm Password</label>
          <input type='password' name='password' required className='input input-bordered w-full' />
        </div>
        <div className='pb-2 flex justify-center'>
          <button className='btn btn-error' type='submit'>
            DELETE ACCOUNT
          </button>
        </div>
      </form>
    </>
  );
}
