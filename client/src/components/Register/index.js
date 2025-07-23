import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { registerUser, loginUser } from '../../api'
import './index.css'

const Register = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return setErrorMsg('Passwords do not match')
    }
    try {
      await registerUser({ username, password })
      const loginResp = await loginUser({ username, password })
      login(loginResp.user, loginResp.token)
      navigate('/')
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Register failed')
    }
  }

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>
        {errorMsg && <p>{errorMsg}</p>}
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <input value={confirmPassword} type="password" onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
        <button type="submit">Register</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  )
}

export default Register
