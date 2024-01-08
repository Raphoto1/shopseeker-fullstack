//imports propios
import ShopsPack from "@/components/ShopsPack";
import { allShopsPath } from "@/enums/SuperVariables";

export default function shopsByUser({ params }) {
  const { id } = params;
  return (
    <>
      <ShopsPack mainPath={allShopsPath} userId={id} />
    </>
  );
}
