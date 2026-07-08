
//imports Propios
import ShopsPack from "@/components/ShopsPack"
import { allShopsPath } from "@/enums/SuperVariables"

// 🚀 ISR: Regenerar esta página cada 30 segundos (tiendas cambian más frecuentemente)
export const revalidate = 30;

export default function allShops() {
  return (
      <>
          <ShopsPack mainPath={allShopsPath } />
    </>
  )
}
