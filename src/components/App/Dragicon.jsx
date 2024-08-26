import React from 'react';

const DragIcon = ({ onDragStart, onDragEnd, draggable }) => (
    <div 
                className="cursor-move p-2 mr-2"
            draggable={draggable}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
            className="drag-icon"
            
        >
            <path d="M5 4v2H3V4h2M5 10v2H3v-2h2M5 16v2H3v-2h2M11 4v2H9V4h2M11 10v2H9v-2h2M11 16v2H9v-2h2M17 4v2h-2V4h2M17 10v2h-2v-2h2M17 16v2h-2v-2h2" />
        </svg>
    </div>

);

export default DragIcon;