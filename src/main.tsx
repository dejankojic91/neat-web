import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ScreenStackProvider } from "./navigation/ScreenStackProvider.tsx"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ScreenStackProvider>
      <App />
    </ScreenStackProvider>
  </StrictMode>,
)
