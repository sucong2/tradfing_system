import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import MainLayout from '../layouts/MainLayout'
import BacktestResults from '../components/backtest/BacktestResults'
import type { BacktestConfig } from '../types/strategy'
import { runBacktest } from '../features/strategy/strategySlice'
import type { RootState, AppDispatch } from '../store'

function BacktestPage() {
  const { strategyId = '' } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { currentStrategy, backtestResults, isLoading } = useSelector(
    (state: RootState) => state.strategy
  )

  const [config, setConfig] = useState<BacktestConfig>({
    strategyId,
    startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    endDate: new Date(),
    initialCapital: 10000,
    symbol: 'BTCUSDT',
    timeframe: '1D',
    isDemo: true,
    isBacktest: true,
    isLive: false,
  })

  const handleInputChange = (field: keyof BacktestConfig, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleRunBacktest = () => {
    dispatch(runBacktest(config))
  }

  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          백테스팅
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  백테스트 설정
                </Typography>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="시작일"
                    value={config.startDate}
                    onChange={(date) => handleInputChange('startDate', date)}
                    slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                  />
                  <DatePicker
                    label="종료일"
                    value={config.endDate}
                    onChange={(date) => handleInputChange('endDate', date)}
                    slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                  />
                </LocalizationProvider>

                <TextField
                  fullWidth
                  margin="normal"
                  label="초기 자본"
                  type="number"
                  value={config.initialCapital}
                  onChange={(e) =>
                    handleInputChange('initialCapital', Number(e.target.value))
                  }
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel>종목</InputLabel>
                  <Select
                    value={config.symbol}
                    label="종목"
                    onChange={(e) => handleInputChange('symbol', e.target.value)}
                  >
                    <MenuItem value="BTCUSDT">Bitcoin (BTCUSDT)</MenuItem>
                    <MenuItem value="ETHUSDT">Ethereum (ETHUSDT)</MenuItem>
                    <MenuItem value="XRPUSDT">Ripple (XRPUSDT)</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>타임프레임</InputLabel>
                  <Select
                    value={config.timeframe}
                    label="타임프레임"
                    onChange={(e) => handleInputChange('timeframe', e.target.value)}
                  >
                    <MenuItem value="1m">1분</MenuItem>
                    <MenuItem value="5m">5분</MenuItem>
                    <MenuItem value="15m">15분</MenuItem>
                    <MenuItem value="1h">1시간</MenuItem>
                    <MenuItem value="4h">4시간</MenuItem>
                    <MenuItem value="1D">1일</MenuItem>
                  </Select>
                </FormControl>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                  실행 모드
                </Typography>

                <FormControl component="fieldset" sx={{ mt: 1 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Button
                        variant={config.isDemo ? 'contained' : 'outlined'}
                        fullWidth
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            isDemo: true,
                            isBacktest: false,
                            isLive: false,
                          }))
                        }
                      >
                        데모
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        variant={config.isBacktest ? 'contained' : 'outlined'}
                        fullWidth
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            isDemo: false,
                            isBacktest: true,
                            isLive: false,
                          }))
                        }
                      >
                        백테스트
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        variant={config.isLive ? 'contained' : 'outlined'}
                        fullWidth
                        disabled
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            isDemo: false,
                            isBacktest: false,
                            isLive: true,
                          }))
                        }
                      >
                        실전
                      </Button>
                    </Grid>
                  </Grid>
                </FormControl>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 3 }}
                  onClick={handleRunBacktest}
                  disabled={isLoading}
                >
                  {isLoading ? '실행 중...' : '백테스트 실행'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            {backtestResults ? (
              <BacktestResults results={backtestResults} />
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  p: 4,
                }}
              >
                <Typography variant="body1" color="text.secondary" align="center">
                  백테스트를 실행하면 여기에 결과가 표시됩니다.
                  <br />
                  왼쪽에서 백테스트 설정을 구성하고 '백테스트 실행' 버튼을 클릭하세요.
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  )
}

export default BacktestPage 