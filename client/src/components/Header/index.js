import {useAuth} from '../../context/AuthContext'
import {useNavigate, Link} from 'react-router-dom'
import './index.css'

const Header = () => {
  const {user, logout} = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="header-container">
      <div className="header-content">
        <Link to="/" className="header-logo">
          💬 ConnecteR
        </Link>
        {user && (
          <div className="header-actions">
            <span className="header-user">Hi, {user.username}</span>
            <button type="button" className="header-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Header
