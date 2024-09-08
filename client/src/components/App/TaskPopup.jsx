import React, { useState } from 'react';

function TaskPopup({ isOpen, onClose, onSubmit }) {
    const [taskName, setTaskName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskName.trim()) {
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            onSubmit(taskName, start, end);
            setTaskName('');
            setStartDate('');
            setEndDate('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="relative bg-gray-700 bg-opacity-30 p-5 rounded-2xl flex justify-center shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
                <input
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="Enter task ..."
                    className="p-2 border-b bg-red-500 bg-opacity-0 mb-2 text-white placeholder-white focus:outline-none"
                />
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2 border-b bg-red-500 bg-opacity-0 mb-2 text-white placeholder-white focus:outline-none"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="p-2 border-b bg-red-500 bg-opacity-0 mb-2 text-white placeholder-white focus:outline-none"
                />
                <div className="flex justify-between">
                    <button type="submit" className="bg-gray-700 bg-opacity-30 hover:bg-green-400 hover:shadow-lg hover:shadow-green-500 rounded-xl text-white px-4 py-2 transition-all">
                        Add Task
                    </button>
                    <button type="button" onClick={onClose} className="mr-2 px-4 py-2 rounded-xl hover:bg-red-600 hover:shadow-lg hover:shadow-red-500 transition-all">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TaskPopup;
