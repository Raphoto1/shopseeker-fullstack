import { useState } from "react";

export default function ChangePassword({ userId }) {
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [oldPass, setOldPass] = useState("");
  const modalController = () => {
    document.getElementById("changePassModal").showModal();
  };
  const handleChangePass = (e) => {
    if (pass === confirmPass) {
      if (pass === oldPass) {
        e.preventDefault();
        alert("New password can not be the same as Old Password");
      } else {
        if (confirm("Are you sure to Change your Password")) {
          e.preventDefault();
          let form = document.getElementById("changePassForm");
          let formData = new FormData(form);
          formData.append("uId", userId);
          let url = "/api/user/help/change-Pass";
          const result = fetch(url, {
            method: "POST",
            credentials: "include",
            body: formData,
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.status===200) {
                alert("password changed successfully");
                document.getElementById('changePassModal').close()
              } else {
                e.preventDefault()
                alert(`error updating ${data.message}`);
              }
            })
        } else {
          alert("Error updating");
        }
      }
    } else {
      e.preventDefault();
      alert("New Password and confirm do not match");
    }
  };
  return (
    <>
      <button className='btn bg-primary-content' onClick={modalController}>
        Change Password
      </button>
      <dialog id='changePassModal' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box flex align-middle justify-center'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
          </form>
          <div>
            <h3 className='font-bold text-xl'>Change Password</h3>
          </div>
          <div>
            <form onSubmit={handleChangePass} id='changePassForm'>
              <div className='pb-2'>
                <label htmlFor='oldPass'>Old Password</label>
                <input type='password' name='oldPass' className='input input-bordered w-full' onChange={(e) => setOldPass(e.target.value)} />
              </div>
              <div className='pb-2'>
                <label htmlFor='newPass'>New Password</label>
                <input type='password' name='newPass' className='input input-bordered w-full' onChange={(e) => setPass(e.target.value)} />
              </div>
              <div className='pb-2'>
                <label htmlFor='newPassConfirm'>New Password Confirm</label>
                <input type='password' name='newPassConfirm' className='input input-bordered w-full' onChange={(e) => setConfirmPass(e.target.value)} />
              </div>
              <div className='pb-2'>
                <button className='btn' type='submit'>
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
