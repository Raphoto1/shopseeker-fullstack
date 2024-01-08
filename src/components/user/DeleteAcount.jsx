export default function DeleteAccount() {
  const modalController = () => {
    document.getElementById("deleteAccountModal").showModal();
  };
  const handleDeleteAccount = () => {
    alert("hago el delete de acccountr");
  };
  return (
    <>
      <button className='btn btn-error' onClick={modalController}>
        Delete Account
      </button>
      <dialog id='deleteAccountModal' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box flex align-middle justify-center'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
          </form>
          <div>
            <h3 className='font-bold text-xl'>Delete Account</h3>
          </div>
          <div>
            <form onSubmit={handleDeleteAccount} id='deleteAccountForm'>
              <div className='pb-2'>
                <label htmlFor='email'>Email</label>
                <input type='email' name='email' className='input input-bordered w-full' />
              </div>
              <div className='pb-2'>
                <label htmlFor='Password'>Password</label>
                <input type='password' name='Password' className='input input-bordered w-full' />
              </div>
              <div className='pb-2'>
                <button className='btn' type='submit'>
                  Delete Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
