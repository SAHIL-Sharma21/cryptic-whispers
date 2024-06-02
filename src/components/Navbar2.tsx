'use client'

import React from 'react'

const Navbar2 = () => {
  return (
    <>
        <nav className='p-4 md:p-6 shadow-md bg-gray-900 text-white'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <a href="/" className='text-xl font-bold mb-4 md:mb-0'>Cryptic Whispers</a>
            </div>
        </nav>
    </>
  )
}

export default Navbar2