import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/users/login', form);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div><label>Email</label><br /><input name="email" type="email" value={form.email} onChange={onChange} required /></div>
        <div><label>Password</label><br /><input name="password" type="password" value={form.password} onChange={onChange} required /></div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
