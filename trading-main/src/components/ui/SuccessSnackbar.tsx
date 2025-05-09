import { forwardRef } from 'react'
import { Snackbar, Alert } from '@mui/material'
import type { AlertProps } from '@mui/material'

const SnackbarAlert = forwardRef<HTMLDivElement, AlertProps>(function SnackbarAlert(
  props,
  ref,
) {
  return <Alert elevation={6} ref={ref} variant="filled" {...props} />
})

interface SuccessSnackbarProps {
  open: boolean
  message: string
  onClose: () => void
}

function SuccessSnackbar({ open, message, onClose }: SuccessSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <SnackbarAlert onClose={onClose} severity="success">
        {message}
      </SnackbarAlert>
    </Snackbar>
  )
}

export default SuccessSnackbar 