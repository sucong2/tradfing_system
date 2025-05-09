import type { ChangeEvent } from 'react'
import { Box, TextField, Typography } from '@mui/material'
import type { StrategyMetadata } from '../../types/strategy'

interface StrategyMetadataFormProps {
  metadata: StrategyMetadata
  onChange: (metadata: StrategyMetadata) => void
}

function StrategyMetadataForm({ metadata, onChange }: StrategyMetadataFormProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onChange({
      ...metadata,
      [name]: value,
    })
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        전략 기본 정보
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        label="전략 이름"
        name="name"
        value={metadata.name}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="개발자"
        name="developer"
        value={metadata.developer}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="설명"
        name="description"
        value={metadata.description}
        onChange={handleChange}
        multiline
        rows={4}
      />
    </Box>
  )
}

export default StrategyMetadataForm 