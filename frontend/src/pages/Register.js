import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();
  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/users/register', form);
      alert('Registered successfully. Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={submit}>
        <div><label>Username</label><br /><input name="username" value={form.username} onChange={onChange} required /></div>
        <div><label>Email</label><br /><input name="email" type="email" value={form.email} onChange={onChange} required /></div>
        <div><label>Password</label><br /><input name="password" type="password" value={form.password} onChange={onChange} required /></div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
