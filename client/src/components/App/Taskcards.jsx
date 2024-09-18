import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskPopup from "./TaskPopup";
import TaskListOptions from './TaskListOptions';
import EditTask from './EditTask';
import Draghere from './Draghere';
import DragIcon from './Dragicon';
import BoxPopup from './BoxPopup';
import EditBox from './EditBox';
import BoxListOptions from './BoxListOptions';
import ColorPicker from './ColorPicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';



const Taskcards = ({ onCloseModal }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editBoxModalOpen, setEditBoxModalOpen] = useState(false);
    const [currentBoxIndex, setCurrentBoxIndex] = useState(null);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(null);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [boxModalOpen, setBoxModalOpen] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedColor, setSelectedColor] = useState("#aabbcc");
    const [dragImage, setDragImage] = useState(null);
    const editFormRef = useRef(null);
    const navigate = useNavigate();
    

    const initialBoxes  = [
        { name: 'Pending', tasks: [], color: 'red'},
        { name: 'Processing', tasks: [], color: 'yellow'},
        { name: 'Completed', tasks: [], color: '#6ee7b7'},
    ];
    const [boxes, setBoxes] = useState(() => {
        const savedBoxes = JSON.parse(localStorage.getItem('taskBoxes'));
        return savedBoxes || initialBoxes;
    });

    // const [boxes, setBoxes] = useState([]);

    // Save boxes and taskDates to local storage
    useEffect(() => {
        const fetchBoxes = async () => {
            const token = localStorage.getItem('token');
            const decodedToken = decodeJwt(token);
            const userId = decodedToken._id;
    
            try {
                const response = await axios.get(`/api/task-boxes/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
    
                setBoxes(response.data);
            } catch (error) {
                console.error('Error fetching task boxes:', error.response?.data || error);
            }
        };
    
        fetchBoxes();
    }, []);  // Run only on component mount

    // Save task boxes to localStorage whenever they change
    // useEffect(() => {
    //     localStorage.setItem('taskBoxes', JSON.stringify(boxes));
    // }, [boxes]);
    // const addNewBox = (boxName) => {
    //     const updatedBoxes = [...boxes, { name: boxName, tasks: [], color: selectedColor}];
    //     setBoxes(updatedBoxes);
    //     closeBoxModal();
    // };
    
    const addNewBox = async (boxName) => {
        const token = localStorage.getItem('token');
        const decodedToken = decodeJwt(token); // Assuming decodeJwt correctly decodes the token
        const userId = decodedToken._id;

        if (!token) {
            console.error('No token found');
            return;
        }
    
        try {
            const response = await axios.post(
                `/api/task-boxes/${userId}`,
                { name: boxName, color: selectedColor }, // Only send name and color
                { headers: { Authorization: `Bearer ${token}` } } // Attach the token
            );
            
    
            const savedBox = response.data;
            const updatedBoxes = [...boxes, savedBox];
            setBoxes(updatedBoxes);
            closeBoxModal();
        } catch (error) {
            console.error('Error adding new box:', error.response?.data || error);
        }
    };
    // done
    

    const generateId = () => {
        return `task-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    };


    const handleColorChange = async (color) => {
        setSelectedColor(color);
    };

    const handlenavigate = () => {
        navigate('/calendar')
    };

    const updateBoxColor = async (index, color) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }
    
        const decodedToken = decodeJwt(token);
        const userId = decodedToken._id;
    
        // Ensure the selected box exists
        if (index < 0 || index >= boxes.length) {
            console.error('Invalid box index');
            return;
        }
    
        const selectedBox = boxes[index];
        const boxId = selectedBox._id;
    
        try {
            // Update local state immediately
            setBoxes(prevBoxes => 
                prevBoxes.map((box, i) => 
                    i === index ? { ...box, color: color, tasks: box.tasks.map(task => ({ ...task, color: color })) } : box
                )
            );
    
            // Send the updated color to the backend
            const response = await axios.put(
                `/api/task-boxes/${userId}/${boxId}/color`,  // API endpoint to update box color
                { color: color },  // Payload containing the new color
                { headers: { Authorization: `Bearer ${token}` } }  // Authorization header
            );
    
            console.log('API Response:', response.data);
    
        } catch (error) {
            console.error('Error updating box color:', error.response?.data || error);
        }
    
        console.log('Selected color:', color);
    };
    // done

    const openBoxModal = (index) => {
        closeModal();
        toggleMenu();
        setCurrentBoxIndex(index);
        setBoxModalOpen(true);
    };

    const closeBoxModal = () => {
        setCurrentBoxIndex(null);
        setBoxModalOpen(false);
    };

    const openEditBoxModal = (boxIndex) => {
        closeModal();
        setCurrentBoxIndex(boxIndex);
        setEditBoxModalOpen(true);
    };

    const closeEditBoxModal = () => {
        setEditBoxModalOpen(false);
        setCurrentBoxIndex(null);
    };

    const openModal = (index) => {
        closeEditModal();
        toggleMenu();
        setCurrentBoxIndex(index);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setCurrentBoxIndex(null);
        onCloseModal && onCloseModal();
    };

    // const handleAddTask = (taskName, startDate = null, endDate = null) => {
    //     const updatedBoxes = [...boxes];
    
    //     const newTask = {
    //         id: generateId(),
    //         name: taskName,
    //         startDate: startDate ? startDate.toISOString().split('T')[0] : null,
    //         endDate: endDate ? endDate.toISOString().split('T')[0] : null,
    //     };
    
    //     updatedBoxes[currentBoxIndex].tasks.push(newTask);
    
    //     setBoxes(updatedBoxes);
    //     localStorage.setItem('taskBoxes', JSON.stringify(updatedBoxes));
    
    //     closeModal();
    // };


    const base64UrlDecode = (str) => {
        // Convert Base64Url to Base64
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        // Pad Base64 string if necessary
        while (base64.length % 4 !== 0) {
            base64 += '=';
        }
        // Decode Base64 string to a string
        return atob(base64);
    };
    
    const decodeJwt = (token) => {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('JWT does not have 3 parts');
        }
    
        const payload = parts[1];
        const decodedPayload = base64UrlDecode(payload);
        return JSON.parse(decodedPayload);
    };
    
    const handleAddTask = async (taskName, startDate = null, endDate = null, boxId) => {
        const token = localStorage.getItem('token');
        const decodedToken = decodeJwt(token);
        const userId = decodedToken._id;
    
        if (!token) {
            console.error('No token found');
            return; // Handle error appropriately, e.g., redirect to login
        }
    
        const id = generateId(); // Generate unique ID for the task
    
        try {
            const newTask = {
                id,
                name: taskName,
                startDate: startDate ? startDate.toISOString().split('T')[0] : null,
                endDate: endDate ? endDate.toISOString().split('T')[0] : null,
                userId, // Add user ID to the task data
            };
            const updatedBoxes = [...boxes];
            updatedBoxes[currentBoxIndex].tasks.push(newTask);
            setBoxes(updatedBoxes);
            closeModal(); // Close the modal after adding the task
    
            // Send the new task to the backend
            const response = await axios.post(
                `/api/task-boxes/${boxId}/tasks`, // API route to add a task to a box
                newTask, // Task data
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            const updatedBox = response.data;
    
            // Update local state based on the response from the backend
            setBoxes(prevBoxes => prevBoxes.map(box => 
                box._id === updatedBox._id ? updatedBox : box
            ));
    
        } catch (error) {
            console.error('Error adding task to box:', error.response?.data || error);
        }
    };
    // done

    // const handleAddTask = (taskName) => {
    //     const updatedBoxes = [...boxes];
    //     updatedBoxes[currentBoxIndex].tasks.push(taskName);
    //     setBoxes(updatedBoxes);
    //     closeModal();
    // };

    const openEditModal = (boxIndex, taskIndex) => {
        closeModal();
        setCurrentBoxIndex(boxIndex);
        setCurrentTaskIndex(taskIndex);
        setEditModalOpen(true);

        setTimeout(() => {
            const taskElement = editFormRef.current;
            if (taskElement) {
                taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setCurrentBoxIndex(null);
        setCurrentTaskIndex(null);
    };

    // const handleEditTask = (taskName, startDate = null, endDate = null) => {
    //     const updatedBoxes = [...boxes];
    //     const task = updatedBoxes[currentBoxIndex].tasks[currentTaskIndex];
    
    //     if (task) {
    //         task.name = taskName;
    //         task.startDate = startDate;
    //         task.endDate = endDate;
    //     }
    
    //     setBoxes(updatedBoxes);
    //     localStorage.setItem('taskBoxes', JSON.stringify(updatedBoxes)); // Update local storage
    //     closeEditModal();
    // };

    // const handleEditBox = (newBoxName) => {
    //     const updatedBoxes = [...boxes];
    //     updatedBoxes[currentBoxIndex].name = newBoxName;
    //     setBoxes(updatedBoxes);
    //     closeEditBoxModal();
    // };

    const handleEditTask = async (taskName, startDate = null, endDate = null) => {
        const token = localStorage.getItem('token');
        const decodedToken = decodeJwt(token);
        const userId = decodedToken._id;
        
        
        if (!token) {
            console.error('No token found');
            return; // Handle the error appropriately
        }
    
        const updatedBoxes = [...boxes];
        const task = updatedBoxes[currentBoxIndex].tasks[currentTaskIndex];
        const boxId = updatedBoxes[currentBoxIndex]._id; // Ensure you have the box's `_id`
        const taskId = task._id; // Ensure you have the task's `_id`
        closeEditModal();
    
        if (task) {
            // Update the task locally
            task.name = taskName;
            task.startDate = startDate;
            task.endDate = endDate;
        }
    
        try {
            // Send update to the backend
            await axios.put(
                `/api/task-boxes/${userId}/${boxId}/tasks/${taskId}`, // Adjust this API path as needed
                { name: taskName, startDate, endDate }, // Data to update
                { headers: { Authorization: `Bearer ${token}` } } // Send authorization token
            );
    
            // Update the state and UI after the successful update in the database
            setBoxes(updatedBoxes);
        } catch (error) {
            console.error('Error updating task in the database:', error.response?.data || error);
        }
    };
    // done
    
    
    const handleEditBox = async (newBoxName) => {
        const updatedBoxes = [...boxes];
        updatedBoxes[currentBoxIndex].name = newBoxName;
        setBoxes(updatedBoxes); // Optimistically update UI
        closeEditBoxModal(); // Close the edit box modal after successful update

        const token = localStorage.getItem('token');
        const decodedToken = decodeJwt(token);
        const userId = decodedToken._id;
    
        if (!token) {
            console.error('No token found');
            return; // Handle error appropriately, e.g., redirect to login
        }
    
        const boxId = boxes[currentBoxIndex]._id; // Get the ID of the box to be updated
    
        try {
            // Make the request to update the box
            const response = await axios.put(
                `/api/task-boxes/${userId}/${boxId}`, // API route to update a box
                { name: newBoxName}, // Data to update
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            const updatedBox = response.data;
    
            // Update the local state based on the response from the backend
            setBoxes(prevBoxes => prevBoxes.map(box => 
                box._id === updatedBox._id ? updatedBox : box
            ));
    
        } catch (error) {
            console.error('Error updating box:', error.response?.data || error);
        }
    };
    // done

    const removeTask = async (boxIndex, taskIndex) => {
        const token = localStorage.getItem('token');
        const boxId = boxes[boxIndex]._id;
        const taskId = boxes[boxIndex].tasks[taskIndex]._id;
        const decodedToken = decodeJwt(token);
        const userId = decodedToken._id;

    
        if (!token) {
            console.error('No token found');
            return; // Handle error appropriately, e.g., redirect to login
        }
    
        try {
            // Update the local state first for a snappy UI response
            const updatedBoxes = [...boxes];
            updatedBoxes[boxIndex].tasks.splice(taskIndex, 1);
            setBoxes(updatedBoxes);
    
            // Now make the API call to remove the task from the database
            await axios.delete(
                `/api/task-boxes/${userId}/${boxId}/tasks/${taskId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
        } catch (error) {
            console.error('Error removing task:', error.response?.data || error);
            // Optionally: Revert state changes in case of error
        }
    };
    // done
    

    const removeBox = async (boxIndex) => {
        const boxId = boxes[boxIndex]._id; // Get the ID of the box to be removed
        const updatedBoxes = [...boxes];
        updatedBoxes.splice(boxIndex, 1); // Optimistically remove the box from the UI
        
        setBoxes(updatedBoxes); // Update local state
        
        const token = localStorage.getItem('token'); // Get the authentication token
        const decodedToken = decodeJwt(token);
        const userId = decodedToken._id;
        console.log(boxId)
    
        try {
            // Send request to delete the box from the database
            await axios.delete(`/api/task-boxes/${userId}/${boxId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Error deleting box:', error);
            // Revert UI changes if the API call fails
            setBoxes(prevBoxes => [...prevBoxes.slice(0, boxIndex), boxes[boxIndex], ...prevBoxes.slice(boxIndex + 1)]);
            // Optionally, show an error message to the user
        }
    };
    // done

    const toggleMenu = (index) => {
        setOpenMenuIndex(openMenuIndex === index ? null : index);
    };

    // const moveTask = (boxIndex, taskIndex, direction) => {
    //     const updatedBoxes = [...boxes];
    //     const task = updatedBoxes[boxIndex].tasks.splice(taskIndex, 1)[0];

    //     if (direction === 'prev' && boxIndex > 0) {
    //         updatedBoxes[boxIndex - 1].tasks.push(task);
    //     } else if (direction === 'next' && boxIndex < boxes.length - 1) {
    //         updatedBoxes[boxIndex + 1].tasks.push(task);
    //     }

    //     setBoxes(updatedBoxes);
    //     setOpenMenuIndex(null);
    // };

    const moveTask = async (boxIndex, taskIndex, direction) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }
    
        const decodedToken = decodeJwt(token);
        const userId = decodedToken._id;
    
        // Ensure the box and task exist
        if (boxIndex < 0 || boxIndex >= boxes.length || taskIndex < 0 || taskIndex >= boxes[boxIndex].tasks.length) {
            console.error('Invalid box or task index');
            return;
        }
    
        const task = boxes[boxIndex].tasks[taskIndex];
        const boxId = boxes[boxIndex]._id;
        const targetBoxIndex = direction === 'prev' ? boxIndex - 1 : direction === 'next' ? boxIndex + 1 : boxIndex;
        const targetBoxId = boxes[targetBoxIndex]?._id;
    
        if (targetBoxIndex < 0 || targetBoxIndex >= boxes.length) {
            console.error('Invalid target box index');
            return;
        }
    
        try {
            // Update local state
            const updatedBoxes = [...boxes];
            updatedBoxes[boxIndex].tasks.splice(taskIndex, 1); // Remove task from current box
            updatedBoxes[targetBoxIndex].tasks.push(task); // Add task to the new box
    
            setBoxes(updatedBoxes);
            setOpenMenuIndex(null);
    
            // Update task position in the backend
            await axios.put(
                `/api/task-boxes/${userId}/${boxId}/tasks/${task._id}/move`,
                { targetBoxId: targetBoxId, direction: direction }, // Payload
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
        } catch (error) {
            console.error('Error moving task:', error.response?.data || error);
        }
    };
    // done

    const handleDragStart = (e, boxIndex, taskIndex) => {
        const taskItem = e.target.closest('.task-item');

        if (!taskItem) return;

        e.dataTransfer.setData('boxIndex', boxIndex);
        e.dataTransfer.setData('taskIndex', taskIndex);
        e.dataTransfer.effectAllowed = 'move';

        // If there's an existing drag image, remove it
        if (dragImage && document.body.contains(dragImage)) {
            document.body.removeChild(dragImage);
        }

        // Create a clone of the task item to use as the drag image
        const dragImageClone = taskItem.cloneNode(true);
        dragImageClone.style.position = 'absolute';
        dragImageClone.style.top = '-1000px'; // Hide it off-screen
        document.body.appendChild(dragImageClone);
        e.dataTransfer.setDragImage(dragImageClone, 0, 0);

        setDragImage(dragImageClone);

        taskItem.classList.add('dragging');
    };

    const handleDragEnd = (e) => {
        const taskItem = e.target.closest('.task-item');

        if (taskItem) {
            taskItem.classList.remove('dragging');
        }

        // Ensure the custom drag image is removed from the DOM
        if (dragImage && document.body.contains(dragImage)) {
            document.body.removeChild(dragImage);
            setDragImage(null);
        }
    };

    // const handleDropOnBox = (e, dropBoxIndex, dropTaskIndex) => {
    //     e.preventDefault();
    
    //     const dragBoxIndex = parseInt(e.dataTransfer.getData('boxIndex'), 10);
    //     const dragTaskIndex = parseInt(e.dataTransfer.getData('taskIndex'), 10);
    
    //     // Create a copy of the boxes state
    //     const updatedBoxes = [...boxes];
    
    //     // Get the dragged task
    //     const draggedTask = updatedBoxes[dragBoxIndex].tasks[dragTaskIndex];
    
    //     // Remove the dragged task from its original position
    //     updatedBoxes[dragBoxIndex].tasks.splice(dragTaskIndex, 1);
    
    //     if (dropTaskIndex !== undefined && dropTaskIndex >= 0) {
    //         updatedBoxes[dropBoxIndex].tasks.splice(dropTaskIndex + 1, 0, draggedTask);
    //     } else {
    //         updatedBoxes[dropBoxIndex].tasks.unshift(draggedTask);
    //     }
    
    //     // Update the state with the new boxes array
    //     setBoxes(updatedBoxes);
    // };
    const handleDropOnBox = async (e, dropBoxIndex, dropTaskIndex) => {
        e.preventDefault();
    
        const dragBoxIndex = parseInt(e.dataTransfer.getData('boxIndex'), 10);
        const dragTaskIndex = parseInt(e.dataTransfer.getData('taskIndex'), 10);
    
        // Create a copy of the boxes state
        const updatedBoxes = [...boxes];
    
        // Get the dragged task
        const draggedTask = updatedBoxes[dragBoxIndex].tasks[dragTaskIndex];
    
        // Remove the dragged task from its original position
        updatedBoxes[dragBoxIndex].tasks.splice(dragTaskIndex, 1);
    
        if (dropTaskIndex !== undefined && dropTaskIndex >= 0) {
            updatedBoxes[dropBoxIndex].tasks.splice(dropTaskIndex + 1, 0, draggedTask);
        } else {
            updatedBoxes[dropBoxIndex].tasks.unshift(draggedTask);
        }
    
        setBoxes(updatedBoxes);
    
        try {
            const token = localStorage.getItem('token');
            const decodedToken = decodeJwt(token);
            const userId = decodedToken._id;
    
            if (!token) {
                console.error('No token found');
                return;
            }
    
            // Get the IDs for the task and boxes
            const dropBoxId = updatedBoxes[dropBoxIndex]._id;
            const taskId = draggedTask._id;
    
            // Update task in the database
            await axios.put(
                `/api/task-boxes/${userId}/${dropBoxId}/tasks/${taskId}/add`,
                { boxes: updatedBoxes },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error('Error updating task positions in database:', error.response?.data || error);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDropOnTask = async (e, dropBoxIndex, dropTaskIndex) => {
        e.preventDefault();
    
        const dragBoxIndex = parseInt(e.dataTransfer.getData('boxIndex'), 10);
        const dragTaskIndex = parseInt(e.dataTransfer.getData('taskIndex'), 10);
    
        if (dragBoxIndex === dropBoxIndex && dropTaskIndex === dragTaskIndex) {
            return; // No operation if dropped on the same task
        }
    
        let updatedBoxes = [...boxes];
        let draggedTask = null;
    
        if (dragBoxIndex === dropBoxIndex) {
            // Same box - reordering tasks
            draggedTask = updatedBoxes[dragBoxIndex].tasks[dragTaskIndex];
            updatedBoxes[dragBoxIndex].tasks.splice(dragTaskIndex, 1);
    
            if (dropTaskIndex >= updatedBoxes[dragBoxIndex].tasks.length) {
                updatedBoxes[dragBoxIndex].tasks.push(draggedTask);
            } else if (dragTaskIndex < dropTaskIndex) {
                updatedBoxes[dragBoxIndex].tasks.splice(dropTaskIndex, 0, draggedTask);
            } else {
                updatedBoxes[dragBoxIndex].tasks.splice(dropTaskIndex + 1, 0, draggedTask);
            }
        } else {
            // Different boxes - moving task between boxes
            handleDropOnBox(e, dropBoxIndex, dropTaskIndex);
        }
    
        setBoxes(updatedBoxes);
    
        try {
            const token = localStorage.getItem('token');
            const decodedToken = decodeJwt(token);
            const userId = decodedToken._id;
    
            if (!token) {
                console.error('No token found');
                return;
            }
    
            // Get the IDs for the task and boxes
            const dropBoxId = updatedBoxes[dropBoxIndex]._id;
            const taskId = draggedTask._id;
    
            // Update task in the database
            await axios.put(
                `/api/task-boxes/${userId}/${dropBoxId}/tasks/${taskId}/update-order`,
                { boxes: updatedBoxes },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error('Error updating task positions in database:', error.response?.data || error);
        }
    };

    const handleContextMenu = (e, boxIndex, taskIndex) => {
        e.preventDefault();
    
        // Close any open modals
        closeModal();
        closeEditModal();
    
        // Calculate the correct position using getBoundingClientRect
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
    
        // Set the position and open the menu
        setMenuPosition({
            x: offsetX,
            y: offsetY,
        });
        setCurrentBoxIndex(boxIndex);
        setCurrentTaskIndex(taskIndex);
        setOpenMenuIndex(`${boxIndex}-${taskIndex}`);
    };

    const handleBoxContextMenu = (e, index) => {
        e.preventDefault();
    
        // Calculate the correct position using getBoundingClientRect
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
    
        // Set the position of the context menu
        setMenuPosition({ x: offsetX, y: offsetY });
        setOpenMenuIndex(`${index}`);
    };

    const handleClickOutside = (e) => {
        if (!e.target.closest('.task-list-options') && openMenuIndex !== null) {
            setOpenMenuIndex(null);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    },);

    const renderTaskCards = () => (
        <>
                {/* <SpeedInsights /> */}
            <div className='z-50 fixed left-0 top-1/2 transfrom -translate-y-1/2 h-auto bg-gray-700 bg-opacity-30 flex flex-col justify-center items-center rounded-tr-lg rounded-br-lg' style={{ height: '50vh' }}>
                <div className='self-center'>
                    <button
                        onClick={() => openBoxModal()}
                        className=" m-1 px-4 py-2 relative bg-gray-700 bg-opacity-30 rounded-2xl text-xl drop-shadow-lg transition-all hover:bg-blue-300 hover:shadow-lg hover:shadow-blue-400/50"
                    >
                        +
                    </button>
                </div>
            </div>
            {/* Calendar Button Added 8/27/2024*/}
            <div className='flex justify-end' onClick={handlenavigate}>
                <div className='flex justify-end m-5 max-w-fit bg-gray-700 bg-opacity-30 rounded-xl'>
                    <button className='p-3 m-2 bg-gray-700 bg-opacity-30 rounded-xl' onClick={handlenavigate}>
                        calendar
                    </button>
                </div>
            </div>

        <div className='grid lg:grid-cols-3 md:grid-cols-2 gap-4 relative m-20'  id="workspace">
        {boxes.map((box, index) => (
            <div key={box._id} className="relative">
                <div className='flex justify-between'
                    onDrop={(e) => handleDropOnTask(e, index)}
                    onDragOver={handleDragOver}
                    onContextMenu={(e) => handleBoxContextMenu(e, index)}
                    >
                    <h1 className='self-center p-2'>{box.name}</h1>
                    <div
                    id='contextMenu'
                    className='absolute z-50'
                    style={{ left: `${menuPosition.x}px`, top: `${menuPosition.y}px` }}
                    >
                        {/* Box List Options */}
                        {openMenuIndex === `${index}` && (
                            <div>
                                <BoxListOptions 
                                style={{ position: 'absolute', left: menuPosition.x, top: menuPosition.y }}
                                isOpen={openMenuIndex === `${index}`}
                                onToggle={() => setOpenMenuIndex(`${index}`)}
                                onEdit={() => openEditBoxModal(index)}
                                onRemove={() => removeBox(index)}
                                onClose={() => setOpenMenuIndex(null)}
                                index={index}
                                handleColorChange={updateBoxColor}
                                color={box.color}
                                />                                
                            </div>
                        )}
                        {/* Edit Box */}
                        {editBoxModalOpen && currentBoxIndex === index && (
                            <div ref={editFormRef} className="absolute p-5 rounded-xl z-50 bg-gray-600 bg-opacity-60 backdrop-blur-sm">
                                <EditBox
                                isOpen={editBoxModalOpen}
                                onClose={closeEditBoxModal}
                                onSubmit={handleEditBox}
                                initialTaskName={boxes[currentBoxIndex]}
                                />
                            </div>
                        )}
                    </div>
                    <button onClick={() => openModal(index)} className=' add-task-button px-3 py-2 my-5 bg-gray-700 bg-opacity-30 rounded-2xl text-xl drop-shadow-lg transition-all '
                        style={{
                            backgroundColor: box.color,
                            '--box-color': box.color
                        }}
                    >
                        <div className='bg-gray-600 rounded-xl px-2 bg-opacity-30'>
                            +
                        </div>
                    </button>
                </div>
                <div className='p-5 rounded-2xl'
                key={index}
                style={{backgroundColor: `${box.color}`}}
                color={box.color}
                >
                <Draghere
                    key={index}
                    className="task-item flex justify-between my-10 rounded-2xl p-5 bg-gray-700 bg-opacity-30 taskBoxHover"
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnTask(e, index)}
                    draggable
                />
                    <ul>
                        {box.tasks.map((task, taskIndex) => (
                            <div key={taskIndex} className="relative transition-all">
                                    <div
                                    key={taskIndex}
                                    className="task-item flex justify-between my-5 rounded-2xl p-5 bg-gray-700 bg-opacity-30 transition-all"
                                    onContextMenu={(e) => handleContextMenu(e, index, taskIndex)}
                                    onDragEnd={handleDragEnd}>
                                        <div className='flex flex-col'>
                                            <li className='overflow-hidden border-b m-2 p-1 self-start transition-all'>
                                                {task.name}
                                            </li>
                                            <p className='text-xs self-end text-white bg-gray-400 bg-opacity-20 p-1 rounded-xl'>
                                                {task.startDate && task.endDate 
                                                    ? `${task.startDate} : ${task.endDate}` 
                                                    : (task.startDate 
                                                        ? `Start: ${task.startDate}` 
                                                        : (task.endDate 
                                                            ? `End: ${task.endDate}` 
                                                            : ' ')
                                                    )
                                                }
                                            </p>
                                        </div>
                                        <div
                                        onDragStart={(e) => handleDragStart(e, index, taskIndex)}
                                        onDragEnd={handleDragEnd}
                                        draggable
                                        className='flex self-center'>
                                            <DragIcon/>
                                            </div>
                                        </div>
                                            <div className='self-center' key={taskIndex}>
                                    </div>
                                    <div
                                    className='absolute z-50' // Ensure the position is absolute and z-index is high
                                    style={{ left: `${menuPosition.x}px`, top: `${menuPosition.y}px` }} // Apply the mouse position
                                    >
                                        {/* Task List Options */}
                                        {openMenuIndex === `${index}-${taskIndex}` && (
                                            <TaskListOptions
                                            style={{ position: 'absolute', left: menuPosition.x, top: menuPosition.y }}
                                                isOpen={openMenuIndex === `${index}-${taskIndex}`}
                                                onToggle={() => toggleMenu(`${index}-${taskIndex}`)}
                                                onEdit={() => openEditModal(index, taskIndex)}
                                                onRemove={() => removeTask(index, taskIndex)}
                                                onClose={() => setOpenMenuIndex(null)}
                                                onMove={moveTask}
                                                index={index}
                                                tasksIndex={taskIndex}
                                                boxesLength={boxes.length}
                                            />
                                        )}
                                    </div>
                                        {/* Drag Here */}
                                    <div className='flex justify-center transition-all'>
                                        <Draghere
                                            key={taskIndex}
                                            className="task-item flex justify-between my-10 rounded-2xl p-5 bg-gray-700 bg-opacity-30 taskBoxHover"
                                            onDragStart={(e) => handleDragStart(e, index, taskIndex)}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDropOnTask(e, index, taskIndex)}
                                            draggable
                                        />
                                    </div>
                                <div
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDropOnTask(e, index, box.tasks.length)}
                                />
                                {/* Edit Task */}
                                {editModalOpen && currentBoxIndex === index && currentTaskIndex === taskIndex && (
                                    <div ref={editFormRef} className="relative w-full p-5 rounded-xl z-50 bg-gray-600 bg-opacity-30 backdrop-blur-sm">
                                        <EditTask
                                            isOpen={editModalOpen}
                                            onClose={closeEditModal}
                                            onSubmit={handleEditTask}
                                            initialTaskName={boxes[currentBoxIndex].tasks[currentTaskIndex]?.name || ''}
                                            taskPlaceName={task.name}
                                            initialStartDate={boxes[currentBoxIndex].tasks[currentTaskIndex]?.startDate || ''}
                                            initialEndDate={boxes[currentBoxIndex].tasks[currentTaskIndex]?.endDate || ''}
                                            />
                                    </div>
                                )}
                                </div>
                        ))}
                    </ul>
                    {/* Task PopUp */}
                    {modalOpen && currentBoxIndex === index && (
                        <TaskPopup
                        isOpen={modalOpen}
                        onClose={closeModal}
                        // onSubmit={handleAddTask}
                        onSubmit={(taskName, startDate, endDate) => handleAddTask(taskName, startDate, endDate, box._id)}
                        />
                    )}
                </div>
            </div>
        ))}
        {/* Box PopUp */}
        <div className='self-center'>
            {boxModalOpen && (
                <div>
                    <BoxPopup
                    isOpen={openBoxModal}
                    onClose={closeBoxModal}
                    onSubmit={addNewBox}
                    />
                    <ColorPicker onColorChange={handleColorChange}/>
                </div>
            )}
        </div>
    </div>
    </>
    );
    return renderTaskCards();
};
export default Taskcards;