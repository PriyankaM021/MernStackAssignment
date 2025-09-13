import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Todo() {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchTasks();
  }, [token]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks', { headers: { Authorization: `Bearer ${token}` } });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) logout();
    }
  };

  const add = async e => {
    e.preventDefault();
    if (!text) return;
    try {
      const res = await axios.post('/api/tasks', { content: text }, { headers: { Authorization: `Bearer ${token}` } });
      setTasks(prev => [res.data, ...prev]);
      setText('');
    } catch (err) { console.error(err); }
  };

  const toggle = async (t) => {
    try {
      const res = await axios.put('/api/tasks/' + t._id, { completed: !t.completed }, { headers: { Authorization: `Bearer ${token}` } });
      setTasks(prev => prev.map(p => p._id === res.data._id ? res.data : p));
    } catch (err) { console.error(err); }
  };

  const remove = async (id) => {
    if (!confirm('Delete task?')) return;
    try {
      await axios.delete('/api/tasks/' + id, { headers: { Authorization: `Bearer ${token}` } });
      setTasks(prev => prev.filter(p => p._id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>Todo List - {user?.username}</h2>
        <div>
          <button onClick={()=>{ logout(); navigate('/login'); }}>Logout</button>
        </div>
      </div>

      <form onSubmit={add}>
        <input placeholder="New task..." value={text} onChange={e=>setText(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      <ul>
        {tasks.map(t => (
          <li key={t._id} style={{margin:'10px 0'}}>
            <input type="checkbox" checked={t.completed} onChange={()=>toggle(t)} />{' '}
            <span style={{textDecoration: t.completed ? 'line-through' : 'none'}}>{t.content}</span>
            <button style={{marginLeft:10}} onClick={()=>remove(t._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
