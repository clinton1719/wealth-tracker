import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router'
import App from './App.tsx'
import { NavigationBar } from './components/layout/navigationBar.tsx'
import { Toaster } from './components/ui/sonner.tsx'
import Login from './features/auth/login.tsx'
import SignUp from './features/auth/signup.tsx'
import ViewExpenses from './features/expense/viewExpenses.tsx'
import { store } from './store.ts'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route index element={<App />} />
        <Route path="expense" element={<ViewExpenses />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  </Provider>
)
