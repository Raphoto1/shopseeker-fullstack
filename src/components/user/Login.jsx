"use client";

import { testPath } from "@/enums/SuperVariables";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const modalController = () => {
    document.getElementById("loginModal").showModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let form = document.getElementById("loginForm");
    let formData = new FormData(form);
    const emailCatch = formData.get("email");
    const passCath = formData.get("password");
    const response = await packSession(emailCatch, passCath);
    async function packSession(emailIn, passIn) {
      const setSession = await signIn("credentials", {
        email: emailIn,
        password: passIn,
        redirect: false,
      });
      if (setSession.ok) return router.push("/");
      if (setSession.error) return alert("email or password error");
    }
  };

  return (
    <>
      <button className='btn' onClick={modalController}>
        Login
      </button>
      <dialog id='loginModal' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box flex align-middle justify-center'>
          <form method='dialog'>
            <h3 className='font-bold text-lg pr-2'>Let's Login</h3>
            {/* if there is a button in form, it will close the modal */}
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
          </form>
          <div>
            <form id='loginForm' onSubmit={handleSubmit}>
              <div className='pb-2'>
                <label htmlFor='email'>Email</label>
                <input type='email' name='email' id='email' className='input input-sm input-bordered max-w-xs w-full rounded-lg px-1 py-2' />
              </div>
              <div>
                <label htmlFor='password'>Password</label>
                <input type='password' name='password' id='password' className='input input-sm input-bordered max-w-xs w-full rounded-lg px-1 py-2' />
              </div>
              <div className='flex justify-end pt-2'>
                <button type='submit' className='btn btn-success'>
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
