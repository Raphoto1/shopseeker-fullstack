export default function recoveryPass() {
  const handleResetPass = () => {
    alert("se resetea");
  };
  return (
    <>
      <form onSubmit={handleResetPass}>
        <div className='pb-2'>
          <label htmlFor='email'>Email</label>
          <input type='email' name='email' className='input input-bordered w-full' />
        </div>
        <div className='pb-2'>
          <label htmlFor='securityCode'>Security Code</label>
          <input type='text' name='securityCode' className='input input-bordered w-full' />
        </div>
        <div className='pb-2'>
          <label htmlFor='newPass'>New Password</label>
          <input type='password' name='newPass' className='input input-bordered w-full' />
        </div>
        <div className='pb-2'>
          <label htmlFor='newPassConfirm'>New Password Confirm</label>
          <input type='password' name='newPassConfirm' className='input input-bordered w-full' />
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
