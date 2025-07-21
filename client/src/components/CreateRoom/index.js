import {useState} from 'react'
import './index.css'

const CreateRoom = ({onCreateRoom}) => {
  const [roomName, setRoomName] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = event => {
    event.preventDefault()

    if (roomName.trim() === '') {
      setErrorMsg('Room name cannot be empty')
      return
    }

    onCreateRoom(roomName)
    setRoomName('')
    setErrorMsg('')
  }

  return (
    <div className="createroom-container">
      <form className="createroom-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter new room name"
          className="createroom-input"
          value={roomName}
          onChange={e => setRoomName(e.target.value)}
        />
        <button type="submit" className="createroom-button">
          Create
        </button>
      </form>
      {errorMsg && <p className="createroom-error">{errorMsg}</p>}
    </div>
  )
}

export default CreateRoom
