import React, { memo } from 'react'
import Link from 'next/link'
import { FaCircleArrowRight } from 'react-icons/fa6'

function FlowShops() {
 return (
    <div>
        <div className='flex justify-center p-5'>
        <Link href={"/allshops"} prefetch={true}>
          <h1 className='btn btn-info h-auto justify-center text-center text-2xl'>Check All My Designs</h1>
        </Link>
      </div>
        <div className='md:5xl:flex-col sm:flex w-full sm:h-20 pt-5'>
          <Link href={"/allshops"} className='grid flex-grow card bg-base-300 rounded-box place-items-center px-5' prefetch={true}>
            <div>Find your Favorite design</div>
          </Link>
          <div className='divider sm:divider-vertical md:divider-horizontal'>
            <FaCircleArrowRight size={70} className='rotate-90 md:rotate-0' />
          </div>
          <div className='grid flex-grow card bg-base-300 rounded-box place-items-center align-middle'>Follow your preffered shop</div>
          <div className='divider sm:divider-vertical md:divider-horizontal'>
            <FaCircleArrowRight size={70} className='rotate-90 md:rotate-0' />
          </div>
          <div className='grid flex-grow card bg-base-300 rounded-box place-items-center'>Enjoy!!!</div>
        </div>
      </div>
  )
}

export default memo(FlowShops);
