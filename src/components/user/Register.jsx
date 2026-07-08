"use client";
//imports de app
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
//imports propios
import { registerPath } from "@/enums/SuperVariables";

export default function Register() {
  const router = useRouter();
  const [role, setRole] = useState("fan");
  const [pass, setPass] = useState("");
  const [passConf, setPassConf] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const modalController = () => {
    document.getElementById("registerModal").showModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (pass !== passConf) {
      setFormError("Passwords do not match.");
      return;
    }

    if (pass.length < 8) {
      setFormError("Password must contain at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const emailCatch = formData.get("email");
      const passCatch = formData.get("password");
      formData.append("role", role);

      const response = await fetch(registerPath, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || data?.status >= 400) {
        setFormError(data?.message || "Unable to create account. Try again.");
        return;
      }

      const setSession = await signIn("credentials", {
        email: emailCatch,
        password: passCatch,
        redirect: false,
      });

      if (setSession?.ok) {
        router.push("/");
        return;
      }

      setFormError("Account created, but automatic login failed. Please log in.");
    } catch (error) {
      setFormError("Unexpected error. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button className='btn btn-primary w-full sm:w-auto' onClick={modalController}>
        Register
      </button>
      <dialog id='registerModal' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box w-full max-w-lg'>
          <form method='dialog'>
            <h3 className='font-bold text-lg'>Let's Register</h3>
            {/* if there is a button in form, it will close the modal */}
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
          </form>
          <div className='mt-4'>
            <form id='registerForm' onSubmit={handleSubmit} className='space-y-3'>
              <div className='baseData'>
                <label htmlFor='register-name' className='label'>
                  <span className='label-text'>First Name</span>
                </label>
                <input
                  type='text'
                  name='name'
                  id='register-name'
                  placeholder='Your artistic name also works'
                  autoComplete='given-name'
                  className='input input-bordered w-full'
                />
              </div>
              <div>
                <label htmlFor='register-email' className='label'>
                  <span className='label-text'>Email</span>
                </label>
                <input
                  type='email'
                  name='email'
                  id='register-email'
                  required
                  autoComplete='email'
                  className='input input-bordered w-full'
                />
              </div>
              <fieldset>
                <legend className='label'>
                  <span className='label-text font-semibold'>You are...</span>
                </legend>
                <div className='mt-1 flex flex-wrap gap-3'>
                  <label className='label cursor-pointer gap-2 rounded-lg border border-base-300 px-3 py-2'>
                    <input
                      type='radio'
                      name='roleChoice'
                      className='radio radio-sm radio-primary'
                      checked={role === "artist"}
                      onChange={() => setRole("artist")}
                    />
                    <span className='label-text'>Artist</span>
                  </label>
                  <label className='label cursor-pointer gap-2 rounded-lg border border-base-300 px-3 py-2'>
                    <input
                      type='radio'
                      name='roleChoice'
                      className='radio radio-sm radio-primary'
                      checked={role === "fan"}
                      onChange={() => setRole("fan")}
                    />
                    <span className='label-text'>Fan</span>
                  </label>
                </div>
              </fieldset>

              <div>
                <label htmlFor='register-password' className='label'>
                  <span className='label-text'>Password</span>
                </label>
                <input
                  type='password'
                  name='password'
                  id='register-password'
                  onChange={(e) => setPass(e.target.value)}
                  required
                  minLength={8}
                  autoComplete='new-password'
                  className='input input-bordered w-full'
                />
                <p className='mt-1 text-xs text-base-content/60'>Minimum 8 characters.</p>
              </div>

              <div>
                <label htmlFor='register-confirm-password' className='label'>
                  <span className='label-text'>Confirm Password</span>
                </label>
                <input
                  type='password'
                  name='confirmPassword'
                  id='register-confirm-password'
                  onChange={(e) => setPassConf(e.target.value)}
                  required
                  minLength={8}
                  autoComplete='new-password'
                  className='input input-bordered w-full'
                />
              </div>

              {formError && <p className='text-sm text-error'>{formError}</p>}

              <div className='pt-2'>
                <button type='submit' className='btn btn-primary w-full' disabled={isSubmitting}>
                  {isSubmitting ? "Creating account..." : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
