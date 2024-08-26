import React, { useEffect, useState } from 'react'

const EditTask = ( {isOpen, onClose, onSubmit, initialTaskName} ) => {

    const [taskName, setTaskName] = useState(initialTaskName);

    useEffect(() => {
        setTaskName(initialTaskName);
    }, [initialTaskName]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskName.trim()) {
            onSubmit(taskName);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
    <div>
        <form onSubmit={handleSubmit}>
            <input 
            type="text" 
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder='Edit task ...'
            className='p-2 w-full mb-2 text-white border-b placeholder-white bg-red-400 bg-opacity-0 focus:outline-none'
            />
            <div className='flex justify-between'>
                <button type='submit' className='bg-gray-700 bg-opacity-30 text-white px-4 py-2 rounded-xl hover:bg-green-400 hover:shadow-lg hover:shadow-green-500 transition-all'>Save</button>
                <button type='button' onClick={onClose} className='mr-2 px-4 py-2 rounded-xl hover:bg-red-600 hover:shadow-lg hover:shadow-red-500 transition-all'>Cancel</button>
            </div>
        </form>
    </div>
    );
};
export default EditTask;