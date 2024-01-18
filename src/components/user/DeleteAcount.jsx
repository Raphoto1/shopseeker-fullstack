export default function DeleteAccount({userId}) {
  const modalController = () => {
    document.getElementById("deleteAccountModal").showModal();
  };
  const handleDeleteAccount = (e) => {
    if (confirm("You Are About To DELETE your Account, all your data And designs will be deleted!!!")) {
      e.preventDefault();
      let form = document.getElementById('deleteAccountForm');
      let formData = new FormData(form);
      formData.append("uId", userId);
      let url = "/api/user"
      const result = fetch(url, {
        method: 'delete',
        credentials: 'include',
        body:formData
      }).then((res) => res.json())
        .then((data) => {
          if (data.status===200) {
            alert("Please Check Your Email For Further Instructions");
            document.getElementById('deleteAccountModal').close()
          } else {
            e.preventDefault()
            alert(`error Processing delete account ${data.message}`);
          }
      })
    } else {
      alert("Delete Account Aborted")
    }

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
                <label htmlFor='password'>Password</label>
                <input type='password' name='password' className='input input-bordered w-full' />
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
