import React, { useState, useEffect } from 'react';
import './app.css';
import commonAPI from './services/commonAPI';
import serverURL from './services/serverURL';

const App = () => {
  const [todos, setTodos] = useState([]); 
  const [input, setInput] = useState(''); 
  const [isEditing, setIsEditing] = useState(false); 
  const [currentTodo, setCurrentTodo] = useState(null); 

  
  useEffect(() => {
    const fetchTodos = async () => {
      const response = await commonAPI('GET', `${serverURL}/task`);
      if (response && Array.isArray(response)) {
        setTodos(response);
      } else {
        console.error('Error fetching todos:', response);
      }
    };
    fetchTodos();
  }, []);

  
  const handleAddOrUpdateTodo = async () => {
    if (input.trim() === '') return;

    if (isEditing) {
      
      const updatedTodo = { ...currentTodo, text: input };
      const response = await commonAPI(
        'PUT',
        `${serverURL}/task/${currentTodo.id}`,
        updatedTodo
      );
      if (response) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === currentTodo.id ? { ...response } : todo
          )
        );
        setIsEditing(false);
        setCurrentTodo(null);
      }
    } else {
    
      const newTodo = { id: Date.now(), text: input };
      const response = await commonAPI('POST', `${serverURL}/task`, newTodo);
      if (response) {
        setTodos([...todos, response]);
      }
    }

    setInput(''); 
  };

  // Edit 
  const handleEditTodo = (todo) => {
    setIsEditing(true);
    setCurrentTodo(todo);
    setInput(todo.text);
  };

  
  const handleDeleteTodo = async (id) => {
    const response = await commonAPI('DELETE', `${serverURL}/task/${id}`);
    if (response) {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  return (
    <div className="app-container">
      <h1>TODO APP</h1>
      <div className="todo-input-container">
        <input
          type="text"
          placeholder="Enter your todo"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleAddOrUpdateTodo}>
          {isEditing ? 'Update' : 'Add'}
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <span>{todo.text}</span>
            <div className="todo-actions">
              <button className='btn btn-warning text-light me-3' onClick={() => handleEditTodo(todo)}>Edit</button>
              <button className='btn btn-danger  text-light' onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
