import React, { useEffect, useState } from 'react'

const EditBox = ({ isOpen, onClose, onSubmit, initialBoxName }) => {

    const [boxName, setBoxName] = useState(initialBoxName);

    useEffect (() => {
        setBoxName(initialBoxName);
    }, [initialBoxName]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (boxName.trim()) {
            onSubmit(boxName);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                type="text"
                value={boxName}
                onChange={(e) => setBoxName(e.target.value)}
                placeholder='Edit Box Name...'
                className='p-2 w-full mb-2 text-white border-b placeholder-white bg-red-400 bg-opacity-0 focus:outline-none'
                />

                <div className='flex justify-between'>
                    <button type='submit' className='bg-gray-700 bg-opacity-30 text-white px-4 py-2 rounded-xl hover:bg-green-400 hover:shadow-lg hover:shadow-green-500 transition-all'>Save</button>
                    <button type='button' onClick={onClose} className='mr-2 px-4 py-2 rounded-xl hover:bg-red-600 hover:shadow-lg hover:shadow-red-500 transition-all'>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default EditBox;
