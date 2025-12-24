import { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router'
import { NavigationBar } from '@/components/layout/navigationBar.tsx'
import { Toaster } from '@/components/ui/sonner.tsx'
import { Spinner } from '@/components/ui/spinner.tsx'
import Login from '@/features/auth/login.tsx'
import { ProtectedRoute } from '@/features/auth/protectedRoute.tsx'
import SignUp from '@/features/auth/signUp.tsx'
import { store } from '@/store.ts'
import ErrorBoundary from './components/error-boundary/error-boundary'
import { ExpenseStatistics } from './features/expense/expenseStatistics'
import '@/styles/index.css'
import DepositsFeature from './features/investment/deposit/depositsFeature'

const App = lazy(() => import('@/App.tsx'))
const CategoriesSection = lazy(
  () => import('@/features/category/categoriesFeature'),
)
const ExpensesSection = lazy(
  () => import('@/features/expense/expensesFeature'),
)

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <NavigationBar />
      <Suspense fallback={<Spinner className="spinner" />}>
        <ErrorBoundary>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />

            {/* PROTECTED ROUTES */}
            <Route element={<ProtectedRoute />}>
              <Route index element={<App />} />
              <Route path="expense" element={<ExpensesSection />} />
              <Route path="investment" element={<DepositsFeature />} />
              <Route path="expense/statistics" element={<ExpenseStatistics />} />
              <Route path="category" element={<CategoriesSection />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </Suspense>

      <Toaster />
    </BrowserRouter>
  </Provider>,
)
