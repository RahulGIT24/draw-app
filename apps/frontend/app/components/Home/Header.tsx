import React from 'react'
import Logout from '../Logout'

const Header = () => {
    return (
        <div className='flex justify-between items-center z-50 absolute top-12 w-full px-20'>
            <p className="text-white text-5xl font-bold">Dashboard</p>
            <Logout />
        </div>
    )
}

export default Header