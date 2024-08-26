import React from 'react'

const Menu = ( {className, isVisible, toggleMenu} ) => {
    return (
    <div className='cursor-pointer' onClick={toggleMenu}>
        <span className={className}> </span>
        <span className={className}> </span>
        <span className={className}> </span>
        {/* <span className={`h-1 bg-gray-800 ${className} transition-all duration-300`}> </span>
        <span className={`${className} w-1/2`}> </span> */}
    </div>
    )
}
export default Menu;
