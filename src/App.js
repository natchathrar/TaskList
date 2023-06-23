import React, { useState } from 'react';
import AddTaskForm from './AddTask';


const App = () => {
  const [tasks, setTasks] = useState([]);

  const addTask = newTask => {
    setTasks(prevTasks => [...prevTasks, { ...newTask, id: Date.now() }]);
  };



  return (
    <div className='mt-5'>
      <AddTaskForm addTask={addTask} />
    </div>
  );
};

export default App;
