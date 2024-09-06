"use client"
import Header from '@/components/Header'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function page() {
  const router = useRouter()
  const userHasLogin = JSON.parse(localStorage.getItem('userHasLogin') as string) || undefined;
  useEffect(()=>{
    if(!userHasLogin){
      router.push('/sign-in')
    }
  }, [])
  return (
    <div>
      <Header></Header>
      <div className="flex min-h-screen bg-[#18191a] text-white">
        {/* Sidebar */}


        {/* Main Content */}
        

        {/* Right Sidebar */}

      </div>
    </div>
  )
}
