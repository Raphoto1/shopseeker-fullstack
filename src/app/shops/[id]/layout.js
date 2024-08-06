import Page from "./page";

export async function generateMetadata({ params }) {
  const { id } = params;
  let basePath = `${process.env.URL}/api/design/${id}`;
  const data = await fetch(basePath).then((res) => res.json());

  const design = data.payload;

  return {
    openGraph: {
      url: `${process.env.URL}shops/${id}`,
      title: design.title,
      description: design.description,
      images: design.photo,
    },
  };
}
export default Page;
