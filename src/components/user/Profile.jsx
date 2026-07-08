"use client";
//imports de app
import { useSession } from "next-auth/react";
import Image from "next/image";
import UseSWR from "swr";
import Link from "next/link";
//imports propios
import FanOptions from "./fan/FanOptions";
import ArtistOptions from "./artist/ArtistOptions";
import EditInfoForm from "./EditInfoForm";
import ChangePassword from "./ChangePassword";
import DeleteAccount from "./DeleteAcount";
import CreateBlogEntryModal from "@/components/blog/CreateBlogEntryModal";

export default function profile() {
  const { data: session, status } = useSession();
  
  // 🔧 IMPORTANTE: Todos los hooks ANTES de cualquier return
  // UseSWR usa useContext internamente, así que debe llamarse siempre
  const userId = session?.user?._id;
  const userPath = userId ? `/api/user/${userId}` : null;
  
  const fetcher = async (...args) => {
    const res = await fetch(...args);
    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
    return res.json();
  };
  
  // Este hook SIEMPRE se llama, con userPath=null si no hay userId
  const { data, error, isLoading } = UseSWR(userPath, fetcher);
  const designsPath = status === "authenticated" ? "/api/design?limit=200&sortField=title&sortQ=1" : null;
  const { data: designsData } = UseSWR(designsPath, fetcher);
  
  // ====== VALIDACIONES DESPUÉS DE LOS HOOKS ======
  
  if (status === "loading") {
    return (
      <div className='flex h-full w-full justify-center content-center'>
        <span className='loading loading-infinity loading-lg' />
      </div>
    );
  }
  
  if (status === "unauthenticated") {
    return <h1>Please log in to view your profile</h1>;
  }
  
  if (!userId) {
    console.warn("Session user data:", session?.user);
    return <h1>Error: User ID not found in session. Please try logging in again.</h1>;
  }
  
  if (error) {
    console.error("SWR Error:", error);
    return <h1>Error fetching user data: {error.message}</h1>;
  }
  
  if (isLoading)
    return (
      <div className='flex h-full w-full justify-center content-center'>
        <span className='loading loading-infinity loading-lg' />
      </div>
    );
  
  if (!data || !data.payload) {
    console.warn("Data received:", data);
    return <h1>Error: Could not load user data. Please try reloading.</h1>;
  }
  
  const user = data.payload;
  const availableDesigns = designsData?.payload?.docs || [];
  const userEmail = String(user?.email || "").toLowerCase();
  const showBlogCreator = user?.role === "admin" || userEmail === "rafa@creativerafa.com";

  return (
    <div className='min-h-screen bg-gradient-to-br from-base-100 to-base-200 py-12 px-4'>
      <div className='max-w-4xl mx-auto'>
        
        {/* ===== CARD PRINCIPAL: PERFIL ===== */}
        <div className='card bg-base-100 shadow-2xl mb-6 overflow-hidden'>
          <div className='card-body p-8'>
            
            {/* Avatar y Info Principal */}
            <div className='flex flex-col md:flex-row gap-8 items-center md:items-start'>
              {/* Avatar */}
              <div className='flex-shrink-0'>
                <div className='avatar placeholder'>
                  <div className='bg-gradient-to-br from-primary to-secondary text-white rounded-full w-32 ring ring-primary ring-offset-2 ring-offset-base-100'>
                    {user?.avatar ? (
                      <Image src={user?.avatar} height={128} width={128} alt={user?.name} className='w-full h-full object-cover' style={{ width: 'auto', height: 'auto' }} />
                    ) : (
                      <span className='text-5xl font-bold'>{user?.name?.slice(0, 1)?.toUpperCase()}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Información del Usuario */}
              <div className='flex-1 text-center md:text-left'>
                <h1 className='text-4xl font-bold mb-2'>{user?.name}</h1>
                <p className='text-xl text-primary font-semibold mb-4 capitalize gap-2'>
                  {user?.role === 'rafa' ? '🎨 Creator' : user?.role === 'artist' ? '✨ Artist' : '❤️ Collector'}
                </p>
                <p className='text-base-content/70 mb-4'>{user?.email}</p>
                
                {/* About Section */}
                <div className='bg-base-200 rounded-lg p-4 mt-4'>
                  <p className='text-sm opacity-75 mb-2 font-semibold'>About</p>
                  <p className='text-base leading-relaxed'>
                    {user?.description || '📝 No description yet. Add one to let others know more about you!'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== CARD: ACCIONES RÁPIDAS ===== */}
        <div className={`grid grid-cols-2 ${showBlogCreator ? "md:grid-cols-5" : "md:grid-cols-4"} gap-4 mb-6`}>
          {/* Edit Info */}
          <div className='card bg-base-100 shadow-md hover:shadow-lg transition-shadow'>
            <div className='card-body items-center text-center p-4'>
              <span className='text-3xl mb-2'>⚙️</span>
              <EditInfoForm userId={session?.user._id} />
            </div>
          </div>

          {/* Change Password */}
          <div className='card bg-base-100 shadow-md hover:shadow-lg transition-shadow'>
            <div className='card-body items-center text-center p-4'>
              <span className='text-3xl mb-2'>🔐</span>
              <ChangePassword userId={session?.user._id} />
            </div>
          </div>

          {/* Delete Account */}
          <div className='card bg-base-100 shadow-md hover:shadow-lg transition-shadow'>
            <div className='card-body items-center text-center p-4'>
              <span className='text-3xl mb-2'>🗑️</span>
              <DeleteAccount userId={session?.user._id} />
            </div>
          </div>

          {/* Logout */}
          <div className='card bg-base-100 shadow-md hover:shadow-lg transition-shadow'>
            <div className='card-body items-center text-center p-4'>
              <span className='text-3xl mb-2'>👋</span>
              <Link href={"/api/auth/signout"} className='btn btn-sm btn-ghost w-full text-xs'>
                Logout
              </Link>
            </div>
          </div>

          {/* Blog Entry UI */}
          {showBlogCreator && (
            <div className='card bg-base-100 shadow-md hover:shadow-lg transition-shadow'>
              <div className='card-body items-center text-center p-4'>
                <span className='text-3xl mb-2'>📝</span>
                <CreateBlogEntryModal availableDesigns={availableDesigns} />
              </div>
            </div>
          )}
        </div>

        {/* ===== SECCIÓN ESPECIAL: ARTIST/FAN OPTIONS ===== */}
        <div id='special'>
          {user?.role === "artist" || user?.role === "rafa" ? (
            <div className='card bg-base-100 shadow-xl'>
              <div className='card-body'>
                <h2 className='card-title text-2xl mb-6'>📊 Artist Dashboard</h2>
                <ArtistOptions cart={user?.cart[0]._id} userId={session?.user._id} />
              </div>
            </div>
          ) : (
            <div className='card bg-base-100 shadow-xl'>
              <div className='card-body'>
                <h2 className='card-title text-2xl mb-6'>❤️ My Favorites</h2>
                <FanOptions cart={user?.cart[0]._id} />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
