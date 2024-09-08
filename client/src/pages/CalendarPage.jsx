import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // For time adjustment
import interactionPlugin from '@fullcalendar/interaction';
import ViewOptions from '../components/Calendar/ViewOptions';

const CalendarPage = () => {
    const [boxes, setBoxes] = useState([]); // State to hold task boxes
    const [events, setEvents] = useState([]); // State for calendar events
    const [selectedDate, setSelectedDate] = useState(null);
    const [view, setView] = useState('dayGridMonth'); // Initial view
    const calendarRef = useRef(null);

    // Fetch tasks from localStorage and convert them into FullCalendar events
    useEffect(() => {
        const savedBoxes = localStorage.getItem('taskBoxes');
        if (savedBoxes) {
            const parsedBoxes = JSON.parse(savedBoxes);
            setBoxes(parsedBoxes);
        }
    }, []);

    // Sync events with the current state of `boxes`
    useEffect(() => {
        const taskEvents = boxes.flatMap(box =>
            box.tasks.map(task => ({
                id: task.id,
                title: task.name,
                start: task.startDate,
                end: task.endDate ? task.endDate : task.startDate,
                color: box.color,
                extendedProps: {
                    color: box.color  // Example color
                },
                allDay: false
            }))
        );
        setEvents(taskEvents);
    }, [boxes]);
    
    

    const handleView = (newView) => {
        setView(newView);
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.changeView(newView);
        }
    };

    const handleDateClick = (arg) => {
        setSelectedDate(arg.dateStr);
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.changeView('timeGridDay', arg.dateStr); // Change view to timeGridDay
        }
    };

    useEffect(() => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.changeView(view);
        }
    }, [view]);

    const formatDate = (isoString) => {
        if (!isoString) return '';
        
        const dateObj = new Date(isoString);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };
    
    

    // Handle event date and time changes (dragging, resizing, or editing)
    const handleEventChange = (changeInfo) => {
        const { event } = changeInfo;
        const { id, start, end } = event;
    
        // Format the start and end dates
        const formattedStart = formatDate(start);
        const formattedEnd = end ? formatDate(end) : formattedStart;
    
        // Update the task in `boxes`
        const updatedBoxes = boxes.map(box => ({
            ...box,
            tasks: box.tasks.map(task => {
                if (task.id === id) {
                    return {
                        ...task,
                        startDate: formattedStart,
                        endDate: formattedEnd,
                    };
                }
                return task;
            })
        }));
    
        // Update state and localStorage
        setBoxes(updatedBoxes);
        localStorage.setItem('taskBoxes', JSON.stringify(updatedBoxes));
    
        // Update FullCalendar events
        const updatedEvents = events.map(ev => {
            if (ev.id === id) {
                return {
                    ...ev,
                    start, // Use the Date object for FullCalendar
                    end: end || start, // Use the Date object for FullCalendar
                };
            }
            return ev;
        });
    
        setEvents(updatedEvents);
    };
    
    

    return (
        <div className='calendar-page flex w-full h-screen'>
            {/* <div className='p-10 z-50 relative left-0 transform h-full bg-gray-700 bg-opacity-30'>
                <div className='flex flex-col justify-center'>
                    Sidebar content here
                </div>
            </div> */}
            <div className='flex-1 flex flex-col'>
                <h1 className='text-3xl text-center mb-4 bg-slate-400 bg-opacity-0'>Calendar</h1>
                <div className='mb-4'>
                    <ViewOptions
                        handleView={handleView}
                        view={view}
                    />
                </div>
                <div className='flex-grow'>
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView={view}
                    events={events}
                    editable={true}
                    droppable={true}
                    selectable={true}
                    dateClick={handleDateClick}
                    eventClick={(info) => {
                        alert(`Event: ${info.event.title}`);
                    }}
                    eventChange={handleEventChange}
                    eventDrop={handleEventChange}
                    eventResize={handleEventChange}
                    allDaySlot={false}
                    slotDuration="00:15:00"
                    slotLabelFormat={{
                        hour: 'numeric',
                        minute: '2-digit',
                        meridiem: 'short',
                    }}
                    height='100%'
                    eventContent={function(info) {
                        const { start, end } = info.event;
                        const color = info.event.extendedProps.color || '#000'; // Assuming color is passed in extendedProps
                    
                        let startDate = new Date(start);
                        let endDate = end ? new Date(end) : null;
                    
                        const formattedStartDate = `${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()} ${startDate.getHours()}:${String(startDate.getMinutes()).padStart(2, '0')}`;
                        const formattedEndDate = endDate ? `${endDate.getMonth() + 1}/${endDate.getDate()}/${endDate.getFullYear()} ${endDate.getHours()}:${String(endDate.getMinutes()).padStart(2, '0')}` : null;
                    
                        let eventContent = '';
                    
                        // Check if no endDate or startDate is equal to endDate
                        if (!endDate || startDate.getTime() === endDate.getTime()) {
                            console.log(color)
                            eventContent = `
                            <div class="flex break-words overflow-hidden">
                                <div class="flex flex-col overflow-hidden items-center truncate self-start">
                                    <div class="flex items-center self-start">
                                        <span class="p-1 rounded-full mr-2" style="background-color: ${color};"></span>
                                        <strong>| ${info.event.title}</strong><br/>
                                    </div>
                                    <small class="self-start">S: ${formattedStartDate}</small>
                                </div>
                            </div>
                            `;
                        } else {
                          // Handle events with both start and end dates
                            eventContent = `
                                <div class="p-2 bg-gray-500 w-fit rounded-xl bg-opacity-40">
                                    <strong>|${info.event.title}</strong><br/>
                                    <small>Start: ${formattedStartDate}</small><br/>
                                    <small>End: ${formattedEndDate}</small>
                                </div>
                            `;
                        }
                    
                        return { html: eventContent };
                        }}
                    />


                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
