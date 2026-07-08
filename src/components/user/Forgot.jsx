'use client'
import { useState } from "react";

export default function Forgot({
  showTrigger = true,
  triggerLabel = "Forgot Password",
  triggerClassName = "btn btn-outline w-full sm:w-auto",
  modalId = "forgotPassModal",
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const modalController = () => {
    setStatusMsg("");
    setErrorMsg("");
    document.getElementById(modalId).showModal();
  };

  const handleForgotPass = async (e) => {
    e.preventDefault();
    setStatusMsg("");
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const url = "/api/user/help/reset-Pass/";
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok && data?.status === 200) {
        setStatusMsg("Please check your email for reset instructions.");
        e.currentTarget.reset();
      } else {
        setErrorMsg(data?.message || "Could not send reset email. Please try again.");
      }
    } catch (error) {
      setErrorMsg("Unexpected error. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {showTrigger && (
        <button className={triggerClassName} onClick={modalController}>
          {triggerLabel}
        </button>
      )}

      <dialog id={modalId} className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box w-full max-w-md'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
          </form>
          <div className='mt-1'>
            <h3 className='font-bold text-xl pr-2'>Reset Password</h3>
            <p className='mt-1 text-sm text-base-content/70'>
              Enter your account email and we will send a reset link.
            </p>
          </div>

          <div className='mt-4'>
            <form onSubmit={handleForgotPass} id={`forgotPassForm-${modalId}`} className='space-y-3'>
              <div>
                <label htmlFor='forgot-email' className='label'>
                  <span className='label-text'>Email</span>
                </label>
                <input
                  type='email'
                  id='forgot-email'
                  name='email'
                  required
                  autoComplete='email'
                  className='input input-bordered w-full'
                />
              </div>

              {statusMsg && <p className='text-sm text-success'>{statusMsg}</p>}
              {errorMsg && <p className='text-sm text-error'>{errorMsg}</p>}

              <div className='pt-1'>
                <button className='btn btn-primary w-full' type='submit' disabled={isSubmitting}>
                  {isSubmitting ? "Sending link..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
