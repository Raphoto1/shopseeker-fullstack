"use client";
//imports de app
import useSWR from "swr";
//imports propios
import CardDesign from "@/components/CardDesign";

export default function Shops() {
  //se usa swr para manejar el fetch por recomendacion de vercel
  const fetcher = async (...args) => await fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSWR("/api/design", fetcher);
  if (error) return console.log("falla del fetch");
  if (isLoading) return <h1>Loading...</h1>;
  const allDesigns = data.payload;
  console.log(allDesigns);
  return (
    <>
      <div className='p-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-3'>
        <h1>designs</h1>
        {allDesigns.map((des) => (
          <div key={des._id}>
            <CardDesign 
              key={des._id}
              id={des._id}
              title={des.title}
              description={des.description}
              category={des.category}
              photo={des.photo}
              shops={des.shops } />
          </div>
        ))}
      </div>
    </>
  );
}
