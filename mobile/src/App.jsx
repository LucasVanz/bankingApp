import { useState } from 'react'
import api from './services/api' // Certifique-se que o api.js existe na pasta services

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  

  const handleLogin = async (e) => {
    e.preventDefault() // Impede a página de recarregar
    try {
      // Faz a chamada para o seu Back-end Java
      const response = await api.post('/auth/login', { email, password })
      // Se der certo, o token vai aparecer no Console do navegador (F12)
      console.log('Login Sucesso! Seu Token:', response.data)
      alert('Login realizado com sucesso! Verifique o Console (F12).')
      
      // Salva o token para usarmos nas próximas telas
      localStorage.setItem('token', response.data.token)
    } catch (err) {
      console.error('Erro ao logar:', err)
      alert('Falha no login. Verifique seu e-mail, senha e se o Java está rodando.')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#2c3e50' }}>LBank Login</h1>
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Digite seu e-mail" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        
        <input 
          type="password" 
          placeholder="Digite sua senha" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        
        <button 
          type="submit" 
          style={{ padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Entrar no Banco
        </button>
      </form>
    </div>
  )
}

export default App