import React, { useState, useEffect } from 'react';
import './app.css';
import commonAPI from './services/commonAPI';
import serverURL from './services/serverURL';

const App = () => {
  const [todos, setTodos] = useState([]); // All tasks
  const [input, setInput] = useState(''); // Input field
  const [isEditing, setIsEditing] = useState(false); // Edit mode toggle
  const [currentTodo, setCurrentTodo] = useState(null); // Todo being edited

  // Fetch all todos from the server
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

  // Add or Update a todo
  const handleAddOrUpdateTodo = async () => {
    if (input.trim() === '') return;

    if (isEditing) {
      // Update the todo
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
      // Add a new todo
      const newTodo = { id: Date.now(), text: input };
      const response = await commonAPI('POST', `${serverURL}/task`, newTodo);
      if (response) {
        setTodos([...todos, response]);
      }
    }

    setInput(''); // Clear input field
  };

  // Edit a todo
  const handleEditTodo = (todo) => {
    setIsEditing(true);
    setCurrentTodo(todo);
    setInput(todo.text);
  };

  // Delete a todo
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
