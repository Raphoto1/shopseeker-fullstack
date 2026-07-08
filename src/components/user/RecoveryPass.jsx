"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RecoveryPass({ tokenIn }) {
  const router = useRouter();
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const hasMismatch = pass.length > 0 && confirmPass.length > 0 && pass !== confirmPass;

  const handleResetPass = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!tokenIn) {
      setErrorMsg("Recovery token is missing or invalid.");
      return;
    }

    if (pass !== confirmPass) {
      setErrorMsg("New Password and Confirm Password do not match.");
      return;
    }

    if (pass.length < 8) {
      setErrorMsg("Password must contain at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.append("token", tokenIn);
      const url = "/api/user/help/reset-Pass";
      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok && data?.status === 200) {
        setSuccessMsg("Password updated successfully. Redirecting to login...");
        e.currentTarget.reset();
        setPass("");
        setConfirmPass("");
        setIsSubmitting(false);
        setTimeout(() => {
          router.push("/auth");
        }, 2000);
        return;
      }

      setErrorMsg(data?.message || "Error updating password. Request a new reset email.");
      setIsSubmitting(false);
    } catch (error) {
      console.error("Reset password error:", error);
      setErrorMsg("Unexpected error. Please try again in a moment.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleResetPass} id='recoveryPassForm' className='space-y-3'>
      <div className='rounded-xl border border-base-300 bg-base-200/40 p-3 text-sm text-base-content/70'>
        Use the same email where you received this recovery link.
      </div>

        <div>
          <label htmlFor='recovery-email' className='label'>
            <span className='label-text'>Confirm your Email</span>
          </label>
          <input
            type='email'
            id='recovery-email'
            name='email'
            required
            autoComplete='email'
            disabled={isSubmitting}
            className='input input-bordered w-full'
          />
        </div>

        <div>
          <label htmlFor='recovery-new-pass' className='label'>
            <span className='label-text'>New Password</span>
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id='recovery-new-pass'
            name='newPass'
            required
            minLength={8}
            autoComplete='new-password'
            disabled={isSubmitting}
            onChange={(e) => setPass(e.target.value)}
            className='input input-bordered w-full'
          />
          <p className='mt-1 text-xs text-base-content/60'>Minimum 8 characters.</p>
        </div>

        <div>
          <label htmlFor='recovery-new-pass-confirm' className='label'>
            <span className='label-text'>Confirm New Password</span>
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id='recovery-new-pass-confirm'
            name='newPassConfirm'
            required
            minLength={8}
            autoComplete='new-password'
            disabled={isSubmitting}
            onChange={(e) => setConfirmPass(e.target.value)}
            className='input input-bordered w-full'
          />
        </div>

        <label className='label cursor-pointer justify-start gap-2'>
          <input
            type='checkbox'
            className='checkbox checkbox-sm'
            checked={showPassword}
            disabled={isSubmitting}
            onChange={(e) => setShowPassword(e.target.checked)}
          />
          <span className='label-text'>Show passwords</span>
        </label>

        {hasMismatch && <p className='text-xs text-warning'>Passwords do not match yet.</p>}

        {errorMsg && (
          <div className='rounded-lg border border-error/50 bg-error/10 p-3 text-sm text-error'>
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className='rounded-lg border border-success/50 bg-success/10 p-3 text-sm text-success'>
            ✓ {successMsg}
          </div>
        )}

        <div className='flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end'>
          <Link 
            href='/auth' 
            className={`btn btn-ghost sm:btn-sm ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}
          >
            Back to Login
          </Link>
          <button className='btn btn-success sm:btn-sm' type='submit' disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className='loading loading-spinner loading-sm'></span>
                Updating password...
              </>
            ) : (
              "Change Password"
            )}
          </button>
        </div>
    </form>
  );
}
