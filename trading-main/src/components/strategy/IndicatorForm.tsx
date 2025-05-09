import { useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CodeEditor from '../common/CodeEditor'
import type { Indicator } from '../../types/strategy'

interface IndicatorFormProps {
  indicators: Indicator[]
  onAdd: (indicator: Indicator) => void
  onRemove: (index: number) => void
}

function IndicatorForm({ indicators, onAdd, onRemove }: IndicatorFormProps) {
  const [newIndicator, setNewIndicator] = useState<Indicator>({
    name: '',
    description: '',
    code: '',
    isSystemBuiltin: false,
  })

  const handleChange = (field: keyof Indicator, value: string | boolean) => {
    setNewIndicator((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddIndicator = () => {
    if (newIndicator.name && newIndicator.code) {
      onAdd(newIndicator)
      setNewIndicator({
        name: '',
        description: '',
        code: '',
        isSystemBuiltin: false,
      })
    }
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        인디케이터 설정
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            margin="normal"
            label="인디케이터 이름"
            value={newIndicator.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="설명"
            value={newIndicator.description}
            onChange={(e) => handleChange('description', e.target.value)}
            multiline
            rows={2}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newIndicator.isSystemBuiltin}
                onChange={(e) => handleChange('isSystemBuiltin', e.target.checked)}
              />
            }
            label="시스템 내장 인디케이터 사용"
          />

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            인디케이터 코드
          </Typography>
          <CodeEditor
            code={newIndicator.code}
            onChange={(code) => handleChange('code', code)}
            language="javascript"
            height="200px"
          />

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleAddIndicator}
            disabled={!newIndicator.name || !newIndicator.code}
          >
            인디케이터 추가
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            추가된 인디케이터 목록
          </Typography>
          {indicators.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              추가된 인디케이터가 없습니다.
            </Typography>
          ) : (
            <List>
              {indicators.map((indicator, index) => (
                <Box key={index}>
                  <ListItem
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => onRemove(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={indicator.name}
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            {indicator.description}
                          </Typography>
                          <br />
                          <Typography
                            variant="body2"
                            component="span"
                            color="text.secondary"
                          >
                            {indicator.isSystemBuiltin
                              ? '시스템 내장 인디케이터'
                              : '사용자 정의 인디케이터'}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider />
                </Box>
              ))}
            </List>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default IndicatorForm 