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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username || !password) {
      setErrorMsg('Please enter both username and password.')
      return
    }

    try {
      const response = await loginUser({ username, password })
      const { user, token } = response

      if (user && token) {
        login(user, token)
        navigate('/')
      } else {
        setErrorMsg('Invalid response from server.')
      }
    } catch (error) {
      const msg = error?.response?.data?.error || 'Login failed. Please try again.'
      setErrorMsg(msg)
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login to ConnectR</h2>
        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          autoComplete="username"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="current-password"
        />

        <button type="submit">Login</button>

        <p className="login-footer">
          Don’t have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
