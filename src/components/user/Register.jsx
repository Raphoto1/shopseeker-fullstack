"use client";
//imports de app
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
//imports propios
import { registerPath, testPath } from "@/enums/SuperVariables";

export default function Register() {
  const router = useRouter()
  const [role, setRole] = useState("fan");
  const [artistChk, setArtistChk] = useState(false);
  const [artistDisabled, setArtistDisabled] = useState(false);
  const [fanChk, setFanChk] = useState(false);
  const [fanDisabled, setFanDisabled] = useState(false);
  const [pass, setpass] = useState("");
  const [passConf, setPassConf] = useState("");

  const modalController = () => {
    document.getElementById("registerModal").showModal();
  };

  const handleArtistChk = (e) => {
    setArtistChk(!artistChk);
    setFanDisabled(!fanDisabled);
  };

  const handleFanChk = (e) => {
    setFanChk(!fanChk);
    setArtistDisabled(!artistDisabled);
  };

  useEffect(() => {
    handleRole();
  }, [artistChk, fanChk]);

  const handleRole = () => {
    artistChk ? setRole("artist") : setRole("fan");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pass === passConf) {
      let form = document.getElementById("registerForm");
      let formData = new FormData(form);
      const emailCatch = formData.get('email');
      const passCatch = formData.get('password');
      formData.append("role", role);
      const response = await fetch(registerPath, {
        method: "POST",
        credentials: "include",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          //agregar redireccionamiento
          packSession(emailCatch, passCatch);
          
        });
    } else {
      alert("passwords don't match");
    }
    async function packSession(emailIn, passIn) {
      const setSession = await signIn("credentials", {
        email: emailIn,
        password: passIn,
        redirect: false
      });
      if (setSession.ok) return router.push("/")
    };
  };
  
  return (
    <>
      <button className='btn' onClick={modalController}>
        Register
      </button>
      <dialog id='registerModal' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box flex align-middle justify-center'>
          <form method='dialog'>
            <h3 className='font-bold text-lg'>Let's Register</h3>
            {/* if there is a button in form, it will close the modal */}
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
          </form>
          <div>
            <form id='registerForm' onSubmit={handleSubmit} className='block-inline'>
              <div className='baseData pb-2'>
                <label htmlFor='first_name'>First Name</label>
                <input
                  type='text'
                  name='name'
                  id='first_name'
                  placeholder='Your artistic name also works'
                  className='input input-sm input-bordered max-w-xs w-full rounded-lg px-1 py-2'
                />
              </div>
              <div className='pb-2'>
                <label htmlFor='email'>Email</label>
                <input type='email' name='email' id='email' required className='input input-sm input-bordered max-w-xs w-full rounded-lg px-1 py-2' />
              </div>
              <div className='flex justify-between max-w-xs w-full pb-2'>
                <h2>You are...</h2>
                <label htmlFor='artist'>Artist 🎨</label>
                <input type='checkbox' name='artist' id='artist' onChange={handleArtistChk} disabled={artistDisabled} className='checkbox' />
                <label htmlFor='artis'>Fan 🎉</label>
                <input type='checkbox' name='fan' id='fan' onChange={handleFanChk} disabled={fanDisabled} className='checkbox' />
              </div>
              <div className='pb-2'>
                <label htmlFor='password'>Password</label>
                <input
                  type='password'
                  name='password'
                  id='password'
                  onChange={(e) => setpass(e.target.value)}
                  required
                  className='input input-sm input-bordered max-w-xs w-full rounded-lg px-1 py-2'
                />
              </div>
              <div className='pb-2'>
                <label htmlFor='confirmPassword'>Confirm Password</label>
                <input
                  type='password'
                  name='confirmPassword'
                  id='confirmPassword'
                  onChange={(e) => setPassConf(e.target.value)}
                  required
                  className='input input-sm input-bordered max-w-xs w-full rounded-lg px-1 py-2'
                />
              </div>
              <div className='extradata'></div>
              <button type='submit' className='btn'>
                Register
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
