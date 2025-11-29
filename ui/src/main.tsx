import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router'
import App from './App.tsx'
import { NavigationBar } from './components/layout/navigationBar.tsx'
import { Toaster } from './components/ui/sonner.tsx'
import Login from './features/auth/login.tsx'
import { ProtectedRoute } from './features/auth/protectedRoute.tsx'
import SignUp from './features/auth/signUp.tsx'
import ViewCategories from './features/category/viewCategories.tsx'
import ViewExpenses from './features/expense/viewExpenses.tsx'
import { store } from './store.ts'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <NavigationBar />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route index element={<App />} />
          <Route path="expense" element={<ViewExpenses />} />
          <Route path="category" element={<ViewCategories />} />
        </Route>
      </Routes>

      <Toaster />
    </BrowserRouter>
  </Provider>,
)
