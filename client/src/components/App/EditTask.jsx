import React, { useEffect, useState } from 'react';

const EditTask = ({ isOpen, onClose, onSubmit, initialTaskName, initialStartDate, initialEndDate }) => {
    const [taskName, setTaskName] = useState(initialTaskName);
    const [startDate, setStartDate] = useState(initialStartDate ? new Date(initialStartDate).toISOString().split('T')[0] : '');
    const [endDate, setEndDate] = useState(initialEndDate ? new Date(initialEndDate).toISOString().split('T')[0] : '');

    useEffect(() => {
        setTaskName(initialTaskName);
        setStartDate(initialStartDate ? new Date(initialStartDate).toISOString().split('T')[0] : '');
        setEndDate(initialEndDate ? new Date(initialEndDate).toISOString().split('T')[0] : '');
    }, [initialTaskName, initialStartDate, initialEndDate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskName.trim()) {
            // Convert startDate and endDate to Date objects if they are not null or undefined
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            // Convert to ISO strings if valid Date objects
            const startISO = start && !isNaN(start.getTime()) ? start.toISOString().split('T')[0] : null;
            const endISO = end && !isNaN(end.getTime()) ? end.toISOString().split('T')[0] : null;

            onSubmit(taskName, startISO, endISO);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="relative w-full p-5 rounded-xl z-50">
            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
                <input 
                    type="text" 
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder={initialTaskName || 'Enter task name ...'}
                    className='p-2 w-full mb-2 text-white border-b placeholder-white bg-red-400 bg-opacity-0 focus:outline-none'
                />
                <label>Start Date:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2 border-b bg-red-500 bg-opacity-0 mb-2 text-white placeholder-white focus:outline-none"
                />
                <label>End Date:</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="p-2 border-b bg-red-500 bg-opacity-0 mb-2 text-white placeholder-white focus:outline-none"
                />
                <div className='flex justify-between'>
                    <button type='submit' className='bg-gray-800 bg-opacity-30 text-white px-4 py-2 rounded-xl hover:bg-green-400 hover:shadow-lg hover:shadow-green-500 transition-all'>Save</button>
                    <button type='button' onClick={onClose} className='mr-2 px-4 py-2 rounded-xl hover:bg-red-600 hover:shadow-lg hover:shadow-red-500 transition-all'>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditTask;
