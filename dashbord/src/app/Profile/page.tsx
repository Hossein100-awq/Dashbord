import Navbar from '@/componnets/US/Navbar'
import ProfileC from '@/componnets/US/ProfileC'
import SideBar from '@/componnets/US/SideBar'
import React from 'react'

const page = () => {
  return (
    <div className='flex min-h-screen bg-slate-100'>
<SideBar/>      
        <div className='mx-auto w-full max-w-5xl px-4 dark:bg-black transition-colors duration-300'>
             <Navbar/>
             <ProfileC/>
        </div>
    </div>
  )
}

export default page