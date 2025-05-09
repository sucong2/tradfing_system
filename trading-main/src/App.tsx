import { CssBaseline, ThemeProvider } from '@mui/material'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import CreateStrategy from './pages/CreateStrategy'
import BacktestPage from './pages/BacktestPage'
import { theme } from './styles/theme'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-strategy" element={<CreateStrategy />} />
        <Route path="/backtest/:strategyId" element={<BacktestPage />} />
        <Route path="/strategies" element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App 