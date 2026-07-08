import CardHero from "@/components/card/CardHero";

//imports de app

export default async function detailDesign({ params }) {
  const { id } = await params;
   
  return (
    <div>
      <CardHero id={id} />
    </div>
  );
}
