import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddTaskForm = () => {
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState({ name: '', description: '', dueDate: '' });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        }
    }, []);

    const handleInputChange = e => {
        setNewTask({ ...newTask, [e.target.name]: e.target.value });
    };

    const handleAddTask = e => {
        e.preventDefault();

        // Validate fields
        const { name, description, dueDate } = newTask;
        let formErrors = {};

        if (!name.trim()) {
            formErrors.name = 'Please enter a task name.';
        }

        if (!description.trim()) {
            formErrors.description = 'Please enter a task description.';
        }

        if (!dueDate.trim()) {
            formErrors.dueDate = 'Please enter a due date.';
        }

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        // Generate unique ID for the new task
        const taskId = Date.now().toString();

        // Create the new task object
        const task = {
            id: taskId,
            name: name.trim(),
            description: description.trim(),
            dueDate: dueDate.trim(),
            completed: false
        };

        // Update tasks list
        const updatedTasks = [...tasks, task];
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));

        // Clear the form inputs and errors
        setNewTask({ name: '', description: '', dueDate: '' });
        setErrors({});
        setShowModal(false);
    };

    const handleDeleteTask = id => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            // Remove task from tasks array
            const updatedTasks = tasks.filter(task => task.id !== id);
            setTasks(updatedTasks);

            // Update tasks in local storage
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        }
    };

    const handleCompleteTask = id => {
        const updatedTasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    return (
        <>
            <div className="container">
                <Button variant="primary" onClick={() => setShowModal(true)} className="float-end mt-3 mb-2">
                    Add Task
                </Button>
            </div>

            <div className="container mt-4 table-responsive rounded-3 border shadow-lg">
                <table className="table table-striped p-0">
                    <thead>
                        <tr>
                            <th>Task Name</th>
                            <th>Description</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => (
                            <tr key={task.id}>
                                <td>{task.name}</td>
                                <td style={{ maxWidth: '300px', wordWrap: 'break-word' }}>{task.description}</td>
                                <td>{task.dueDate}</td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={() => handleCompleteTask(task.id)}
                                        className={`btn ${task.completed ? 'btn-success' : 'btn-primary'} btn-sm`}
                                    >
                                        {task.completed ? 'Completed' : 'Complete'}
                                    </button>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ textAlign: 'center' }}>Add Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddTask}>
                        <Form.Group controlId="name">
                            <Form.Control
                                type="text"
                                name="name"
                                value={newTask.name}
                                onChange={handleInputChange}
                                placeholder="Task name"
                                className='mb-3'
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="description">
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={newTask.description}
                                onChange={handleInputChange}
                                placeholder="Description"
                                className='mb-3'
                                isInvalid={!!errors.description}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.description}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="dueDate">
                            <Form.Control
                                type="date"
                                name="dueDate"
                                value={newTask.dueDate}
                                onChange={handleInputChange}
                                placeholder="Enter your date"
                                isInvalid={!!errors.dueDate}
                                className="text-muted mb-3"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.dueDate}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button variant="primary" type="submit" className='float-end '>
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default AddTaskForm;
