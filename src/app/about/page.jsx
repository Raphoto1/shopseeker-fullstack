import React from 'react'
import Hello from '@/components/home/Hello'

// 🚀 ISR: Regenerar esta página cada 60 segundos
export const revalidate = 60;

export default function AboutPage() {
  return (
    <div>
      <Hello />
    </div>
  )
}
