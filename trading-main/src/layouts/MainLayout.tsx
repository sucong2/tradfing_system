import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material'
import { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Trading System
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flex: 1, py: 3 }}>
        {children}
      </Container>
    </Box>
  )
}

export default MainLayout 