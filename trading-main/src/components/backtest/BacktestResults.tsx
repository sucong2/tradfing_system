import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { BacktestResult } from '../../types/strategy'

interface BacktestResultsProps {
  results: BacktestResult
}

function BacktestResults({ results }: BacktestResultsProps) {
  // 차트 데이터 포맷 변환
  const chartData = results.equityCurve.map((point) => ({
    date: new Date(point.date).toLocaleDateString(),
    equity: point.equity,
  }))

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            백테스트 결과
          </Typography>

          <Grid container spacing={3}>
            {/* 성과 지표 */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      총 수익률
                    </Typography>
                    <Typography
                      variant="h5"
                      color={results.totalReturn >= 0 ? 'success.main' : 'error.main'}
                    >
                      {(results.totalReturn * 100).toFixed(2)}%
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      연간 수익률
                    </Typography>
                    <Typography
                      variant="h5"
                      color={results.annualizedReturn >= 0 ? 'success.main' : 'error.main'}
                    >
                      {(results.annualizedReturn * 100).toFixed(2)}%
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      최대 낙폭
                    </Typography>
                    <Typography variant="h5" color="error.main">
                      {(results.maxDrawdown * 100).toFixed(2)}%
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      샤프 비율
                    </Typography>
                    <Typography
                      variant="h5"
                      color={results.sharpeRatio >= 1 ? 'success.main' : 'warning.main'}
                    >
                      {results.sharpeRatio.toFixed(2)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            {/* 자산 차트 */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                자산 곡선
              </Typography>
              <Box sx={{ height: 300, width: '100%' }}>
                <ResponsiveContainer>
                  <AreaChart
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="equity"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Grid>

            {/* 거래 내역 */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                거래 내역
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>진입 날짜</TableCell>
                      <TableCell>진입 가격</TableCell>
                      <TableCell>청산 날짜</TableCell>
                      <TableCell>청산 가격</TableCell>
                      <TableCell>방향</TableCell>
                      <TableCell align="right">수익</TableCell>
                      <TableCell align="right">수익률</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.trades.map((trade, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {new Date(trade.entryDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{trade.entryPrice.toFixed(2)}</TableCell>
                        <TableCell>
                          {new Date(trade.exitDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{trade.exitPrice.toFixed(2)}</TableCell>
                        <TableCell>
                          {trade.direction === 'long' ? '매수' : '매도'}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: trade.profit >= 0 ? 'success.main' : 'error.main',
                          }}
                        >
                          {trade.profit.toFixed(2)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color:
                              trade.profitPercentage >= 0 ? 'success.main' : 'error.main',
                          }}
                        >
                          {(trade.profitPercentage * 100).toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

export default BacktestResults 