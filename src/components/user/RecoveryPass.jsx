"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RecoveryPass({ tokenIn }) {
  const router = useRouter();
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handleResetPass = (e) => {
    e.preventDefault();
    if (pass === confirmPass) {
      let form = document.getElementById("recoveryPassForm");
      let formData = new FormData(form);
      formData.append("token", tokenIn);
      let url = "/api/user/help/reset-Pass";
      const result = fetch(url, {
        method: "PUT",
        credentials: "include",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            alert("successfully Updated");
            router.push("/auth");
          } else {
            alert("Error updating, check your email or go to forgot Password");
          }
        });
    } else {
      e.preventDefault();
      alert("New Password and Confirm do not match");
    }
  };
  return (
    <>
      <form onSubmit={handleResetPass} id='recoveryPassForm'>
        <div className='pb-2'>
          <label htmlFor='email'>Confirm your Email</label>
          <input type='email' name='email' required className='input input-bordered w-full' />
        </div>
        <div className='pb-2'>
          <label htmlFor='newPass'>New Password</label>
          <input type='password' name='newPass' required onChange={(e) => setPass(e.target.value)} className='input input-bordered w-full' />
        </div>
        <div className='pb-2'>
          <label htmlFor='newPassConfirm'>New Password Confirm</label>
          <input type='password' name='newPassConfirm' required onChange={(e) => setConfirmPass(e.target.value)} className='input input-bordered w-full' />
        </div>
        <div className='pb-2'>
          <button className='btn' type='submit'>
            Change Password
          </button>
        </div>
      </form>
    </>
  );
}
