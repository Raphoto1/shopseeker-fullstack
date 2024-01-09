import { useState } from "react";

export default function ChangePassword() {
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const modalController = () => {
    document.getElementById("changePassModal").showModal();
  };
  const handleChangePass = (e) => {
    if (pass===confirmPass) {
      if (confirm('Are you sure to Change your Password')) {
        alert('se cambia')
        let form = document.getElementById('changePassForm');
        let formData = new FormData(form);
      } else {
        alert('no se cambia')
      }
    } else {
      e.preventDefault();
      alert('New Password and confirm do not match')
    }
  };
  return (
    <>
      <button className='btn' onClick={modalController}>
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
                <label htmlFor='password'>Old Password</label>
                <input type='password' name='oldPassword' className='input input-bordered w-full' />
              </div>
              <div className='pb-2'>
                <label htmlFor='newPass'>New Password</label>
                <input type='password' name='newPass' className='input input-bordered w-full' onChange={(e) => setPass(e.target.value)} />
              </div>
              <div className='pb-2'>
                <label htmlFor='newPassConfirm'>New Password Confirm</label>
                <input type='password' name='newPassConfirm' className='input input-bordered w-full' onChange={(e)=>setConfirmPass(e.target.value)}/>
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
