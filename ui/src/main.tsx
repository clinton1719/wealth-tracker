import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import App from './App.tsx'
import ViewExpenses from './features/expense/viewExpenses.tsx'
import './styles/index.css'
import { NavigationBar } from './components/layout/navigation-bar.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <NavigationBar />
      <Routes>
        <Route index element={<App />} />
        <Route path="expense" element={<ViewExpenses />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
