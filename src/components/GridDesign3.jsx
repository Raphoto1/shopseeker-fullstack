//imports propios
import CardDesign from "@/components/card/CardDesign"

export default function GridDesign3({ designsToSort }) {
  return (
    <>
       <div className='grid grid-flow-row xl:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-2 pt-2 px-1'>
          {designsToSort.map((des) => (
            <div key={des._id}>
              <CardDesign
                key={des._id}
                id={des._id}
                title={des.title}
                description={des.description}
                category={des.category}
                photo={des.photo}
                secondaryPhotos={des.secondaryImages}
                shops={des.shops}
                likes={des.likes}
              />
            </div>
          ))}
        </div>   
    </>
  )
}
