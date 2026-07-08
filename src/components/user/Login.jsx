"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Forgot from "@/components/user/Forgot";

export default function Login() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const modalController = () => {
    document.getElementById("loginModal").showModal();
  };

  const openForgotModal = () => {
    document.getElementById("loginModal").close();
    document.getElementById("forgotPassModalFromLogin").showModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const emailCatch = formData.get("email");
      const passCatch = formData.get("password");
      const setSession = await signIn("credentials", {
        email: emailCatch,
        password: passCatch,
        redirect: false,
      });

      if (setSession?.ok) {
        router.push("/");
        return;
      }

      setErrorMsg("Email or password is incorrect.");
    } catch (error) {
      setErrorMsg("Unexpected error. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button className='btn btn-accent w-full sm:w-auto' onClick={modalController}>
        Login
      </button>
      <dialog id='loginModal' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box w-full max-w-md'>
          <form method='dialog'>
            <h3 className='font-bold text-lg pr-2'>Let's Login</h3>
            {/* if there is a button in form, it will close the modal */}
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
          </form>
          <div className='mt-4'>
            <form id='loginForm' onSubmit={handleSubmit} className='space-y-3'>
              <div>
                <label htmlFor='login-email' className='label'>
                  <span className='label-text'>Email</span>
                </label>
                <input
                  type='email'
                  name='email'
                  id='login-email'
                  required
                  autoComplete='username'
                  className='input input-bordered w-full'
                />
              </div>
              <div>
                <label htmlFor='login-password' className='label'>
                  <span className='label-text'>Password</span>
                </label>
                <input
                  type='password'
                  name='password'
                  id='login-password'
                  required
                  autoComplete='current-password'
                  className='input input-bordered w-full'
                />
              </div>

              <div className='flex justify-end'>
                <button type='button' className='link link-hover text-sm' onClick={openForgotModal}>
                  Forgot password?
                </button>
              </div>

              {errorMsg && <p className='text-sm text-error'>{errorMsg}</p>}

              <div className='flex justify-end pt-2'>
                <button type='submit' className='btn btn-success w-full' disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>

      <Forgot showTrigger={false} modalId='forgotPassModalFromLogin' />
    </>
  );
}
