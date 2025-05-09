import { Box, Grid, Typography } from '@mui/material'
import CodeEditor from '../common/CodeEditor'
import type { Indicator } from '../../types/strategy'

interface StrategyLogicFormProps {
  entryLogic: string
  exitLogic: string
  indicators: Indicator[]
  onEntryChange: (code: string) => void
  onExitChange: (code: string) => void
}

function StrategyLogicForm({
  entryLogic,
  exitLogic,
  indicators,
  onEntryChange,
  onExitChange,
}: StrategyLogicFormProps) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        진입/청산 로직 작성
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            사용 가능한 인디케이터
          </Typography>
          <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            {indicators.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                추가된 인디케이터가 없습니다.
              </Typography>
            ) : (
              <Box component="ul" sx={{ pl: 2 }}>
                {indicators.map((indicator, index) => (
                  <Box component="li" key={index}>
                    <Typography variant="body2" component="code" fontFamily="monospace">
                      {`indicators.${indicator.name}`}
                    </Typography>
                    <Typography variant="body2" component="span" ml={1}>
                      - {indicator.description}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            진입 로직
          </Typography>
          <CodeEditor
            code={entryLogic}
            onChange={onEntryChange}
            language="javascript"
            height="250px"
          />
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              진입 로직은 true/false를 반환하는 함수 형태로 작성하세요.
              <br />
              예: <code>return indicators.ma20 {'>'} indicators.ma50;</code>
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            청산 로직
          </Typography>
          <CodeEditor
            code={exitLogic}
            onChange={onExitChange}
            language="javascript"
            height="250px"
          />
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              청산 로직은 true/false를 반환하는 함수 형태로 작성하세요.
              <br />
              예: <code>return currentPrice &lt; stopLoss || currentPrice {'>'} takeProfit;</code>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default StrategyLogicForm 