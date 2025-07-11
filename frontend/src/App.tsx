import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { BoardPage } from './pages/BoardPage'
import Header from './components/Header.tsx'

function App() {
  return (

    <BrowserRouter>
      <Header></Header>
      <div className="pt-16"> {/* Isso evita que o conteúdo fique colado no topo */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/board/:id" element={<BoardPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
