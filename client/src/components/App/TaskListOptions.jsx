import React from 'react';

const TaskListOptions = ( {isOpen, onToggle, onRemove, onEdit, onClose, onMove, index, tasksIndex, boxesLength} ) => {


    return (
    <div className='relative hover:backdrop-shadow-2xl'>
        {isOpen && (
            <div className="absolute right-0 mt-2 p-5 bg-gray-700 backdrop-blur-sm bg-opacity-30 shadow-lg rounded-lg z-50">
                <ul>
                    <div className='flex flex-col gap-5 justify-center'>
                        <li 
                            className="px-1 py-2 text-center hover:bg-white hover:shadow-lg hover:shadow-white hover:text-black transition-all cursor-pointer right-0 rounded-lg"
                            onClick={() => {
                            onEdit();
                            onToggle()
                            }}
                        >
                            Edit
                        </li>
                        <li 
                            className="px-9 py-2 text-center hover:bg-red-600 hover:shadow-lg hover:shadow-red-500 cursor-pointer bottom-0 right-0 rounded-lg transition-all"
                            onClick={() => {
                            onRemove()
                            onToggle()
                            }}
                        >
                            Remove
                        </li>
                        {index > 0 && (
                            <button onClick={() => onMove(index, tasksIndex, 'prev')} className="px-3 py-1 text-2xl hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-400 rounded-lg transition-all">←</button>
                        )}
                        {index < boxesLength - 1 && (
                            <button onClick={() => onMove(index, tasksIndex, 'next')} className="px-3 py-1 text-2xl hover:bg-blue-300 hover:shadow-lg hover:shadow-blue-400 rounded-lg transition-all">→</button>
                        )}
                    </div>
                </ul>
            </div>
        )}
    </div>
    
    )
}

export default TaskListOptions;