'use client'
export default function Forgot() {
  const modalController = () => {
    document.getElementById("forgotPassModal").showModal();
  };
  const handleForgotPass = (e) => {
    e.preventDefault();
    let form = document.getElementById('forgotPassForm');
    let formData = new FormData(form);
    let url = "/api/user/help/reset-Pass/"
    const result = fetch(url, {
      method: "POST",
      credentials: "include",
      body:formData
    }).then((res) => res.json())
      .then((data) => {
      if (data.status===200) {
        alert('please check your email')
        document.getElementById('forgotPassModal').close()
      } else {
        alert(`${data}`)
      }
    })
  };
  return (
    <>
      <button className='btn' onClick={modalController}>
        Forgot Password
      </button>
      <dialog id='forgotPassModal' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box flex align-middle justify-center'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
          </form>
          <div>
            <h3 className='font-bold text-xl pr-2'>Reset Password</h3>
          </div>
          <div>
            <form onSubmit={handleForgotPass} id='forgotPassForm'>
              <div className='pb-2'>
                <label htmlFor='email'>Email</label>
                <input type='email' name='email' required className='input input-bordered w-full' />
              </div>
              <div className='pb-2'>
                <button className='btn' type='submit'>
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
