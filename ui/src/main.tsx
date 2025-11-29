import { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router'
import { NavigationBar } from './components/layout/navigationBar.tsx'
import { Toaster } from './components/ui/sonner.tsx'
import Login from './features/auth/login.tsx'
import { ProtectedRoute } from './features/auth/protectedRoute.tsx'
import SignUp from './features/auth/signUp.tsx'
import { store } from './store.ts'
import './styles/index.css'
import { Spinner } from './components/ui/spinner.tsx'

const App = lazy(() => import('./App.tsx'));
const ViewCategories = lazy(() => import('./features/category/viewCategories.tsx'));
const ViewExpenses = lazy(() => import('./features/expense/viewExpenses.tsx'));

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <NavigationBar />
      <Suspense fallback={<Spinner />}>
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
      </Suspense>

      <Toaster />
    </BrowserRouter>
  </Provider>,
)
