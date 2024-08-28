import React, { useState } from 'react'
import "./Draghere.css"

const Draghere = ( {onDrop, onDragOver, onDragStart, index, taskIndex} ) => {
    const [showDrop, setShowDrop] = useState(false);

    return (
        <section
        onDragEnter={() => setShowDrop(true)} // Show drop indicator when entering
        onDragStart={(e) => onDragStart(e, index, taskIndex)} // Handle drag start
        onDragLeave={() => setShowDrop(false)} // Hide drop indicator when leaving
        onDragOver={(e) => {
            e.preventDefault(); // Allow dropping
            onDragOver(e); // Custom logic for drag over
        }}
        onDrop={(e) => {
            onDrop(e, index, taskIndex); // Handle the drop logic
            setShowDrop(false); // Hide drop indicator after dropping
        }}
        className={showDrop ? 'p-1 border-y w-full border-red-500 transition-all' : 'hide-drop'} // Toggle class based on showDrop state
        >Drag Here</section>
    )
}
export default Draghere;

// CAnpBKWUH6rHIY8Q