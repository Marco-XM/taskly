import React, { useState, useEffect, useRef } from 'react';
import TaskPopup from "./TaskPopup";
import TaskListOptions from './TaskListOptions';
import EditTask from './EditTask';
import Draghere from './Draghere';
import DragIcon from './Dragicon';
import BoxPopup from './BoxPopup';
import EditBox from './EditBox';
import BoxListOptions from './BoxListOptions';
import ColorPicker from './ColorPicker';

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
    const editFormRef = useRef(null);


    const initialBoxes  = [
        { name: 'Pending', tasks: [], color: 'red'},
        { name: 'Processing', tasks: [], color: 'yellow'},
        { name: 'Completed', tasks: [], color: '#6ee7b7'},
    ];
    const [boxes, setBoxes] = useState(() => {
        const savedBoxes = JSON.parse(localStorage.getItem('taskBoxes'));
        return savedBoxes || initialBoxes;
    });
    useEffect(() => {
        localStorage.setItem('taskBoxes', JSON.stringify(boxes));
    }, [boxes]);
    const addNewBox = (boxName) => {
        const updatedBoxes = [...boxes, { name: boxName, tasks: [], color: selectedColor}];
        setBoxes(updatedBoxes);
        closeBoxModal();
    };

    useEffect(() => {
        localStorage.setItem('taskBoxes', JSON.stringify(boxes));
    }, [boxes]);

    const handleColorChange = (color) => {
        setSelectedColor(color);
    };
    
    const updateBoxColor = (index, color) => {
        setBoxes(prevBoxes => 
            prevBoxes.map((box, i) => 
                i === index ? { ...box, color: color } : box
            )
        );
    };

    const openBoxModal = (index) => {
        closeModal();
        toggleMenu();
        setCurrentBoxIndex(index);
        setBoxModalOpen(true);
    }

    const closeBoxModal = () => {
        setCurrentBoxIndex(null);
        setBoxModalOpen(false);
    }

    const openEditBoxModal = (boxIndex) => {
        closeModal();
        setCurrentBoxIndex(boxIndex);
        setEditBoxModalOpen(true);
    }

    const closeEditBoxModal = () => {
        setEditBoxModalOpen(false);
        setCurrentBoxIndex(null);
    }


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

    const handleAddTask = (taskName) => {
        const updatedBoxes = [...boxes];
        updatedBoxes[currentBoxIndex].tasks.push(taskName);
        setBoxes(updatedBoxes);
        closeModal();
    };

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

    const handleEditTask = (newTaskName) => {
        const updatedBoxes = [...boxes];
        updatedBoxes[currentBoxIndex].tasks[currentTaskIndex] = newTaskName;
        setBoxes(updatedBoxes);
        closeEditModal();
    };

    const handleEditBox = (newBoxName) => {
        const updatedBoxes = [...boxes];
        updatedBoxes[currentBoxIndex].name = newBoxName;
        setBoxes(updatedBoxes);
        closeEditBoxModal();
    }

    const removeTask = (boxIndex, taskIndex) => {
        const updatedBoxes = [...boxes];
        updatedBoxes[boxIndex].tasks.splice(taskIndex, 1);
        setBoxes(updatedBoxes);
    };

    const removeBox = (boxIndex) => {
        const updatedBoxes = [...boxes];
        updatedBoxes.splice(boxIndex, 1);
        setBoxes(updatedBoxes)
    }

    const toggleMenu = (index) => {
        setOpenMenuIndex(openMenuIndex === index ? null : index);
    };

    const moveTask = (boxIndex, taskIndex, direction) => {
        const updatedBoxes = [...boxes];
        const task = updatedBoxes[boxIndex].tasks.splice(taskIndex, 1)[0];

        if (direction === 'prev' && boxIndex > 0) {
            updatedBoxes[boxIndex - 1].tasks.push(task);
        } else if (direction === 'next' && boxIndex < boxes.length - 1) {
            updatedBoxes[boxIndex + 1].tasks.push(task);
        }

        setBoxes(updatedBoxes);
        setOpenMenuIndex(null);
    };
    const [dragImage, setDragImage] = useState(null);

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

    const handleDropOnBox = (e, dropBoxIndex, dropTaskIndex) => {
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
    
        // Update the state with the new boxes array
        setBoxes(updatedBoxes);
    };
    

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDropOnTask = (e, dropBoxIndex, dropTaskIndex) => {
        e.preventDefault();
    
        const dragBoxIndex = parseInt(e.dataTransfer.getData('boxIndex'), 10);
        const dragTaskIndex = parseInt(e.dataTransfer.getData('taskIndex'), 10);

        if (dragBoxIndex === dropBoxIndex && dropTaskIndex === dragTaskIndex) {
            return; // Don't do anything if it's dropped on its related Draghere
        }

        if (dragBoxIndex === dropBoxIndex && dragTaskIndex - dropTaskIndex === 1) {
            return;
        }
    
    
        if (dragBoxIndex === dropBoxIndex) {
            const updatedBoxes = [...boxes];
            const [draggedTask] = updatedBoxes[dragBoxIndex].tasks.splice(dragTaskIndex, 1);
    
            if (dropTaskIndex >= updatedBoxes[dropBoxIndex].tasks.length) {
                updatedBoxes[dropBoxIndex].tasks.push(draggedTask);
            } else if (dragTaskIndex < dropTaskIndex){
                updatedBoxes[dropBoxIndex].tasks.splice(dropTaskIndex, 0, draggedTask);
            } else {
                updatedBoxes[dropBoxIndex].tasks.splice(dropTaskIndex +1, 0, draggedTask);
            }
    
            setBoxes(updatedBoxes);
        } else {
            handleDropOnBox(e, dropBoxIndex, dropTaskIndex);
        }
    };

    const handleContextMenu = (e, boxIndex, taskIndex) => {
        e.preventDefault();
    
        // Close any open modals
        closeModal();
    
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
        <div className='grid lg:grid-cols-3 md:grid-cols-2 gap-4 relative m-20'  id="workspace">
        {boxes.map((box, index) => (
            <div key={index} className="relative">
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
                                        <li className='overflow-hidden self-center transition-all'>
                                            {task}
                                        </li>
                                        <div
                                        onDragStart={(e) => handleDragStart(e, index, taskIndex)}
                                        onDragEnd={handleDragEnd}
                                        draggable>
                                            <DragIcon/>
                                        </div>
                                    </div>
                                    <div
                                    className='absolute z-50' // Ensure the position is absolute and z-index is high
                                    style={{ left: `${menuPosition.x}px`, top: `${menuPosition.y}px` }} // Apply the mouse position
                                    >
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
                                {editModalOpen && currentBoxIndex === index && currentTaskIndex === taskIndex && (
                                    <div ref={editFormRef} className="relative w-full p-5 rounded-xl z-50 bg-gray-600 bg-opacity-60 backdrop-blur-sm">
                                        <EditTask
                                            isOpen={editModalOpen}
                                            onClose={closeEditModal}
                                            onSubmit={handleEditTask}
                                            initialTaskName={boxes[currentBoxIndex].tasks[currentTaskIndex]}
                                            />
                                    </div>
                                )}
                                </div>
                        ))}
                    </ul>
                    {modalOpen && currentBoxIndex === index && (
                        <TaskPopup
                        isOpen={modalOpen}
                        onClose={closeModal}
                        onSubmit={handleAddTask}
                        />
                    )}
                </div>
            </div>
        ))}
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