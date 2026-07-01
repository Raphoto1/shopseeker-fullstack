import React from 'react'

export default function SkillGeneralDescription({ title, description }) {
  return (
    <div>
      <h3 className='text-xl font-bold text-primary-content'>{title}</h3>
      <p className='text-secondary-content'>{description}</p>
    </div>
  )
}
