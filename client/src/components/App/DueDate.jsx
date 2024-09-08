import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Popup Component for selecting dates
const DueDatePopup = ({ onSave, onClose, startDate, endDate }) => {
    const [selectedStartDate, setSelectedStartDate] = useState(startDate || null);
    const [selectedEndDate, setSelectedEndDate] = useState(endDate || null);

    useEffect(() => {
        setSelectedStartDate(startDate || null);
        setSelectedEndDate(endDate || null);
    }, [startDate, endDate]);

    const handleSave = () => {
        if (selectedStartDate && selectedEndDate) {
            onSave(selectedStartDate, selectedEndDate);
        } else {
            alert("Please select both start and end dates.");
        }
    };

    return (
        <div className="due-date-popup flex">
            <h3>Select Start and End Dates</h3>
            <div className="date-picker-container">
                <DatePicker
                    selected={selectedStartDate}
                    onChange={(date) => setSelectedStartDate(date)}
                    selectsStart
                    startDate={selectedStartDate}
                    endDate={selectedEndDate}
                    className="date-picker"
                    placeholderText="Start Date"
                />
                <DatePicker
                    selected={selectedEndDate}
                    onChange={(date) => setSelectedEndDate(date)}
                    selectsEnd
                    startDate={selectedStartDate}
                    endDate={selectedEndDate}
                    minDate={selectedStartDate}
                    className="date-picker"
                    placeholderText="End Date"
                />
            </div>
            <div className="popup-buttons">
                <button onClick={handleSave}>Save</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default DueDatePopup;



// export default DueDate;
