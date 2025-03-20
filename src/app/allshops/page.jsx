
//imports Propios
import ShopsPack from "@/components/ShopsPack"
import { allShopsPath } from "@/enums/SuperVariables"

export default function allShops() {
  return (
      <>
          <ShopsPack mainPath={allShopsPath } />
    </>
  )
}
