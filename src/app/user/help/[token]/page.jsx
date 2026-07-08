
//importPropios
import RecoveryPass from "@/components/user/RecoveryPass";

export default async function recoveryPassGeneral({ params }) {
  const { token } = await params;
  const uuidV4Like = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const isValidToken = typeof token === "string" && uuidV4Like.test(token);
  
  return (
    <main className='min-h-[calc(100vh-6rem)] bg-base-200 px-4 py-10 sm:px-6'>
      <section className='mx-auto w-full max-w-lg rounded-2xl border border-base-300 bg-base-100 p-6 shadow-lg sm:p-8'>
        <h1 className='text-2xl font-bold text-base-content'>Reset your password</h1>
        <p className='mt-2 text-sm text-base-content/70'>
          Confirm your email and set a new secure password.
        </p>
        <div className='mt-6'>
          {isValidToken ? (
            <RecoveryPass tokenIn={token} />
          ) : (
            <p className='rounded-xl border border-error/30 bg-error/10 p-3 text-sm text-error'>
              Invalid recovery link. Please request a new password reset email.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
