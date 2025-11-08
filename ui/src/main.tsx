import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router'
import App from './App.tsx'
import { NavigationBar } from './components/layout/navigation-bar.tsx'
import ViewExpenses from './features/expense/viewExpenses.tsx'
import { store } from './store.ts'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route index element={<App />} />
          <Route path="expense" element={<ViewExpenses />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
