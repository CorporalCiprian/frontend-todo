import axios from 'axios'
import './App.css'
import { useState, useEffect, useCallback } from 'react'

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/todos`

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  const fetchTodos = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/`)
      const sortedTodos = response.data.sort((a, b) => a.id - b.id)
      setTodos(sortedTodos)
    } catch (error) {
      console.error("Eroare la preluarea datelor:", error)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTodos()
  }, [fetchTodos])

//test
  const addTodo = async (e) => {
    e.preventDefault()
    if (!title) return

    try {
      await axios.post(`${API_URL}/`, { title: title })
      setTitle('')
      fetchTodos()
    } catch (error) {
      console.error("Eroare la creare:", error)
    }
  }

  const toggleComplete = async (todo) => {
    try {
      await axios.put(`${API_URL}/${todo.id}`, {
        title: todo.title,
        completed: !todo.completed 
      })
      fetchTodos()
    } catch (error) {
      console.error("Eroare la update status:", error)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      fetchTodos()
    } catch (error) {
      console.error("Eroare la ștergere:", error)
    }
  }

  const startEditing = (todo) => {
    setEditingId(todo.id)
    setEditText(todo.title)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditText('')
  }

  const saveEdit = async (todo) => {
    if (!editText.trim()) return

    try {
      await axios.put(`${API_URL}/${todo.id}`, {
        title: editText,
        completed: todo.completed
      })
      setEditingId(null)
      setEditText('')
      fetchTodos()
    } catch (error) {
      console.error("Eroare la salvarea modificării:", error)
    }
  }

  return (
    <div className="App">
      <h1>To-Do App (FastAPI + React)</h1>
      
      <form onSubmit={addTodo} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Adaugă un task nou..."
        />
        <button type="submit" style={{ marginLeft: '10px' }}>Adaugă</button>
      </form>

      <ul style={{ listStyleType: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '15px 0', borderBottom: '1px solid #444', paddingBottom: '10px' }}>
            
            {editingId === todo.id ? (
              <div style={{ display: 'flex', flex: 1, gap: '10px' }}>
                <input 
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{ flex: 1 }}
                  autoFocus
                />
                <button onClick={() => saveEdit(todo)} style={{ backgroundColor: 'green', color: 'white' }}>Salvează</button>
                <button onClick={cancelEditing}>Anulează</button>
              </div>
            ) : (
              <>
                <span 
                  style={{ 
                    textDecoration: todo.completed ? 'line-through' : 'none', 
                    cursor: 'pointer',
                    flex: 1,
                    textAlign: 'left',
                    color: todo.completed ? 'gray' : 'inherit'
                  }}
                  onClick={() => toggleComplete(todo)}
                >
                  {todo.title}
                </span>
                
                <div style={{ marginLeft: '20px' }}>
                  <button onClick={() => startEditing(todo)} style={{ marginRight: '10px' }}>Editează</button>
                  <button onClick={() => deleteTodo(todo.id)} style={{ backgroundColor: '#cc0000', color: 'white' }}>Șterge</button>
                </div>
              </>
            )}
            
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App