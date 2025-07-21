// src/pages/Login/index.js
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { loginUser } from '../../api'

import './index.css'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMsg('')

    if (username.trim() === '' || password.trim() === '') {
      setErrorMsg('Username and Password are required')
      return
    }

    try {
      const data = await loginUser({ username, password })
      login(data.user, data.token)
      navigate('/')
    } catch (error) {
      setErrorMsg(error.response?.data?.error || 'Login failed. Try again.')
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="login-heading">Login</h1>
        {errorMsg && <p className="error-text">{errorMsg}</p>}
        <input
          type="text"
          className="login-input"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="login-input"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="login-button">Login</button>
        <p className="login-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
