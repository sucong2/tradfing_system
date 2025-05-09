import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import InfoIcon from '@mui/icons-material/Info'
import MainLayout from '../layouts/MainLayout'
import { fetchStrategies, validateStrategy } from '../features/strategy/strategySlice'
import type { RootState, AppDispatch } from '../store'
import type { Strategy } from '../types/strategy'
import StrategyDetailModal from '../components/strategy/StrategyDetailModal'
import SuccessSnackbar from '../components/ui/SuccessSnackbar'

function Home() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation()
  const { strategies, isLoading } = useSelector((state: RootState) => state.strategy)
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  useEffect(() => {
    dispatch(fetchStrategies())
    
    // 다른 페이지에서 넘어온 상태를 확인
    if (location.state?.success) {
      setSnackbarMessage(location.state.message || '작업이 성공적으로 완료되었습니다')
      setSnackbarOpen(true)
      // 상태 초기화
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [dispatch, location, navigate])

  const handleCreateStrategy = () => {
    navigate('/create-strategy')
  }

  const handleRunBacktest = (strategyId: string) => {
    navigate(`/backtest/${strategyId}`)
  }

  const handleValidateStrategy = (strategyId: string) => {
    dispatch(validateStrategy(strategyId))
      .unwrap()
      .then(() => {
        setSnackbarMessage('전략이 성공적으로 검증되었습니다')
        setSnackbarOpen(true)
        // 모달이 열려있으면 닫기
        if (detailModalOpen) {
          setDetailModalOpen(false)
        }
      })
  }

  const handleOpenStrategyDetail = (strategy: Strategy) => {
    setSelectedStrategy(strategy)
    setDetailModalOpen(true)
  }

  const handleCloseStrategyDetail = () => {
    setDetailModalOpen(false)
  }
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  return (
    <MainLayout>
      <SuccessSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleCloseSnackbar}
      />

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">전략 관리</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateStrategy}
        >
          새 전략 생성
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>이름</TableCell>
              <TableCell>개발자</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>생성일</TableCell>
              <TableCell>액션</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {strategies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {isLoading ? (
                    '로딩 중...'
                  ) : (
                    <Box sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        아직 생성된 전략이 없습니다.
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<AddIcon />}
                        sx={{ mt: 2 }}
                        onClick={handleCreateStrategy}
                      >
                        첫 번째 전략 생성하기
                      </Button>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              strategies.map((strategy) => (
                <TableRow 
                  key={strategy.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleOpenStrategyDetail(strategy)}
                >
                  <TableCell>{strategy.metadata.name}</TableCell>
                  <TableCell>{strategy.metadata.developer}</TableCell>
                  <TableCell>
                    <Chip
                      label={strategy.isValid ? '검증됨' : '미검증'}
                      color={strategy.isValid ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {strategy.metadata.createdAt &&
                      new Date(strategy.metadata.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="상세 정보">
                      <IconButton
                        color="info"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenStrategyDetail(strategy);
                        }}
                      >
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                    {!strategy.isValid ? (
                      <Tooltip title="전략 검증">
                        <IconButton
                          color="success"
                          onClick={() => strategy.id && handleValidateStrategy(strategy.id)}
                        >
                          <CheckCircleOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="백테스트 실행">
                        <IconButton
                          color="primary"
                          onClick={() => strategy.id && handleRunBacktest(strategy.id)}
                        >
                          <PlayArrowIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <StrategyDetailModal
        open={detailModalOpen}
        strategy={selectedStrategy}
        onClose={handleCloseStrategyDetail}
        onValidate={handleValidateStrategy}
        onRunBacktest={handleRunBacktest}
      />
    </MainLayout>
  )
}

export default Home 