"use client";
//imports de app
import { useSession } from "next-auth/react";
import useSWR from "swr";

export default function profile(props) {
  const { data: session, status, update } = useSession();
  const userId = session?.user._id;
  const userPath = `/api/user/${userId}`;
  const fetcher = async (...args) => await fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSWR(userPath, fetcher);
  if (error) return <h1>User Not Found</h1>;
  if (isLoading) return <h1>Loading...</h1>;
  const user = data.payload;
  console.log(user);

  return (
    <>
      <div id='generalInfo' className='flex flex-col items-center pt-5'>
        <div className='avatar placeholder'>
          <div className='bg-neutral text-neutral-content rounded-full w-24'>
            <span className='text-xl'>name</span>
          </div>
        </div>
        <div id='userInf' className='flex flex-col items-center'>
          <h2 className='text-2xl'>Hi {user?.role}!</h2>
          <h3 className='text-3xl capitalize'>{user?.name}</h3>
        </div>
        <div className='divider'></div>
        <div className='bg-base-300 w-4/5 rounded-md p-5'>
          <h1 className="text-xl">About</h1>
          <p>
            {user?.description} Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis ex facere perspiciatis distinctio asperiores voluptate
            magnam. Dolore sed, molestias nemo officia a facere eligendi, id adipisci, optio veniam iusto tenetur!{" "}
          </p>
        </div>
      </div>
      <div id='special'>
        {user?.role === "artist" ? (
          <div>
            <h1> opciones de artist/designs</h1>
          </div>
        ) : (
          <div>
            <h1> opciones de fan/carrito(likes)/actualizar datos/contrasena y eliminar cuenta </h1>
          </div>
        )}
      </div>
    </>
  );
}
