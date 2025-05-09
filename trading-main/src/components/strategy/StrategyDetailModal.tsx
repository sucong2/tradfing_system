import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography,
} from '@mui/material'
import type { Strategy } from '../../types/strategy'
import CodeEditor from '../common/CodeEditor'

interface StrategyDetailModalProps {
  open: boolean
  strategy: Strategy | null
  onClose: () => void
  onValidate?: (strategyId: string) => void
  onRunBacktest?: (strategyId: string) => void
}

function StrategyDetailModal({
  open,
  strategy,
  onClose,
  onValidate,
  onRunBacktest,
}: StrategyDetailModalProps) {
  if (!strategy) return null

  const handleValidate = () => {
    if (strategy.id && onValidate) {
      onValidate(strategy.id)
    }
  }

  const handleRunBacktest = () => {
    if (strategy.id && onRunBacktest) {
      onRunBacktest(strategy.id)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{strategy.metadata.name}</Typography>
          <Chip
            label={strategy.isValid ? '검증됨' : '미검증'}
            color={strategy.isValid ? 'success' : 'warning'}
            size="small"
          />
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* 기본 정보 */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              기본 정보
            </Typography>
            <Box sx={{ ml: 2 }}>
              <Typography variant="body2">
                <strong>개발자:</strong> {strategy.metadata.developer}
              </Typography>
              {strategy.metadata.description && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>설명:</strong> {strategy.metadata.description}
                </Typography>
              )}
              {strategy.metadata.createdAt && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>생성일:</strong>{' '}
                  {new Date(strategy.metadata.createdAt).toLocaleString()}
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* 인디케이터 */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              사용된 인디케이터 ({strategy.indicators.length})
            </Typography>
            {strategy.indicators.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                사용된 인디케이터가 없습니다.
              </Typography>
            ) : (
              <Box component="ul" sx={{ ml: 2 }}>
                {strategy.indicators.map((indicator, index) => (
                  <Box component="li" key={index} sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>{indicator.name}</strong>
                      {indicator.isSystemBuiltin && (
                        <Chip
                          label="시스템 내장"
                          size="small"
                          color="info"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Typography>
                    {indicator.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                        {indicator.description}
                      </Typography>
                    )}
                    <Box sx={{ mt: 1, ml: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        인디케이터 코드:
                      </Typography>
                      <CodeEditor
                        code={indicator.code}
                        onChange={() => {}}
                        language="javascript"
                        height="100px"
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* 진입/청산 로직 */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              진입 로직
            </Typography>
            <CodeEditor
              code={strategy.entryLogic}
              onChange={() => {}}
              language="javascript"
              height="150px"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              청산 로직
            </Typography>
            <CodeEditor
              code={strategy.exitLogic}
              onChange={() => {}}
              language="javascript"
              height="150px"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
        {!strategy.isValid && (
          <Button color="success" variant="contained" onClick={handleValidate}>
            전략 검증
          </Button>
        )}
        {strategy.isValid && (
          <Button color="primary" variant="contained" onClick={handleRunBacktest}>
            백테스트 실행
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default StrategyDetailModal 