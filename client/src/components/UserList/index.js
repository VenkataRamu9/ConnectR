import './index.css'

const UserList = () => {
  const users = [
    {id: 1, name: 'Alice', online: true},
    {id: 2, name: 'Bob', online: false},
    {id: 3, name: 'Charlie', online: true},
  ]

  return (
    <div className="userlist-container">
      <h2 className="userlist-title">Online Users</h2>
      <ul className="userlist-list">
        {users.map(user => (
          <li key={user.id} className={`userlist-item ${user.online ? 'online' : 'offline'}`}>
            <span className="userlist-dot" />
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserList
