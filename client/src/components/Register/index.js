import {useState} from 'react'
import {useNavigate, Link} from 'react-router-dom'

import {useAuth} from '../../context/AuthContext'
import './index.css'

const Register = () => {
  const {login} = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = event => {
    event.preventDefault()

    if (
      username.trim() === '' ||
      password.trim() === '' ||
      confirmPassword.trim() === ''
    ) {
      setErrorMsg('All fields are required')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match')
      return
    }

    // Simulate registration (replace with real API logic later)
    login({username})
    navigate('/')
  }

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h1 className="register-heading">Create Account</h1>
        {errorMsg && <p className="error-text">{errorMsg}</p>}
        <input
          type="text"
          className="register-input"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="register-input"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <input
          type="password"
          className="register-input"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
        <button type="submit" className="register-button">
          Register
        </button>
        <p className="register-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  )
}

export default Register
