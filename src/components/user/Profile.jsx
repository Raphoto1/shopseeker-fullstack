"use client";
//imports de app
import { useSession } from "next-auth/react";
import Image from "next/image";
import UseSWR from "swr";
import Link from "next/link";
import { useState } from "react";
//imports propios
import FanOptions from "./fan/FanOptions";
import ArtistOptions from "./artist/ArtistOptions";
import EditInfoForm from "./EditInfoForm";
import ChangePassword from "./ChangePassword";
import DeleteAccount from "./DeleteAcount";

export default function profile() {
  const { data: session, status, update } = useSession();
  const userId = session?.user._id;
  const userPath = `/api/user/${userId}`;
  const fetcher = async (...args) => await fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = UseSWR(userPath, fetcher);
  if (error) return <h1>User Not Found</h1>;
  if (isLoading)
    return (
      <div className='flex h-full w-full justify-center content-center'>
        <span className='loading loading-infinity loading-lg' />
      </div>
    );
  const user = data.payload;

  return (
    <>
      <div id='generalInfo' className='flex flex-col items-center pt-5'>
        <div className='avatar placeholder'>
          <div className='bg-neutral text-neutral-content rounded-full w-24'>
            {user?.avatar ? <Image src={`${user?.avatar}`} height={100} width={100} /> : <span className='text-4xl'>{user?.name.slice(0, 1)}</span>}
          </div>
        </div>
        <div id='userInf' className='flex flex-col items-center'>
          <h2 className='text-2xl'>Hi {user?.role}!</h2>
          <h3 className='text-3xl capitalize'>{user?.name}</h3>
        </div>
        <div className='divider'></div>
        <div className='bg-base-300 w-4/5 rounded-md p-5 text-center'>
          <h1 className='text-xl text-center'>About</h1>
          <p>{user?.description ? `${user?.description}` : "Tell the world about you, go to edit info and add a description"}</p>
        </div>
      </div>
      <p className='flex justify-center'>Registered Email {user?.email}</p>
      <div id='generalOptions' className='flex justify-evenly flex-wrap p-2'>
        <div id='logout' className='p-2'>
          <Link href={"/api/auth/signout"}>
            <button className='btn bg-primary-content'>Logout</button>
          </Link>
        </div>
        <div id='editInfo' className='p-2'>
          <EditInfoForm userId={session?.user._id} />
        </div>
        <div className='p-2'>
          <ChangePassword userId={session?.user._id} />
        </div>
        <div className='p-2'>
          <DeleteAccount userId={session?.user._id} />
        </div>
        {/* <div className="p-2">
          <button className='btn'>Change to {user?.role === "artist" ? "Fan" : "Artist"}</button>
        </div> */}
      </div>
      <div id='special'>
        {user?.role === "artist" || "rafa" ? (
          <div>
            <ArtistOptions cart={user?.cart[0]._id} userId={session?.user._id} />
          </div>
        ) : (
          <div>
            <FanOptions cart={user?.cart[0]._id} />
          </div>
        )}
      </div>
    </>
  );
}
