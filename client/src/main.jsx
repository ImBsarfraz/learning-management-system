import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { Toaster } from './components/ui/sonner'
import { useLoadUserQuery } from './redux/features/api/authApi'
import LoadingSpinner from './components/LoadingSpinner'

const Custom = ({ children }) => {
  const { isLoading } = useLoadUserQuery();

  return <>{isLoading ? <LoadingSpinner/> : <>{children}</>}</>
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Custom>
        <App />
      </Custom>
      <Toaster />
    </Provider>
  </StrictMode>,
)
