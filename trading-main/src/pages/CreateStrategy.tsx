import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material'
import MainLayout from '../layouts/MainLayout'
import type { Strategy, Indicator, StrategyMetadata } from '../types/strategy'
import { createStrategy } from '../features/strategy/strategySlice'
import StrategyMetadataForm from '../components/strategy/StrategyMetadataForm'
import IndicatorForm from '../components/strategy/IndicatorForm'
import StrategyLogicForm from '../components/strategy/StrategyLogicForm'
import type { AppDispatch } from '../store'

const steps = ['전략 기본 정보', '지표 설정', '진입/청산 로직 작성']

function CreateStrategy() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [strategy, setStrategy] = useState<Partial<Strategy>>({
    metadata: {
      name: '',
      developer: '',
      description: '',
    },
    indicators: [],
    entryLogic: '',
    exitLogic: '',
  })

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleMetadataChange = (metadata: StrategyMetadata) => {
    setStrategy((prev) => ({ ...prev, metadata }))
  }

  const handleAddIndicator = (indicator: Indicator) => {
    setStrategy((prev) => ({
      ...prev,
      indicators: [...(prev.indicators || []), indicator],
    }))
  }

  const handleRemoveIndicator = (index: number) => {
    setStrategy((prev) => {
      const newIndicators = [...(prev.indicators || [])]
      newIndicators.splice(index, 1)
      return { ...prev, indicators: newIndicators }
    })
  }

  const handleEntryLogicChange = (entryLogic: string) => {
    setStrategy((prev) => ({ ...prev, entryLogic }))
  }

  const handleExitLogicChange = (exitLogic: string) => {
    setStrategy((prev) => ({ ...prev, exitLogic }))
  }

  const handleSubmit = async () => {
    if (
      strategy.metadata?.name &&
      strategy.metadata?.developer &&
      strategy.indicators?.length &&
      strategy.entryLogic &&
      strategy.exitLogic
    ) {
      try {
        await dispatch(createStrategy(strategy as Omit<Strategy, 'id'>)).unwrap()
        navigate('/strategies', { 
          state: { 
            success: true, 
            message: `전략 "${strategy.metadata.name}"이(가) 성공적으로 생성되었습니다` 
          } 
        })
      } catch (error) {
        console.error('전략 생성 실패:', error)
      }
    }
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <StrategyMetadataForm
            metadata={strategy.metadata as StrategyMetadata}
            onChange={handleMetadataChange}
          />
        )
      case 1:
        return (
          <IndicatorForm
            indicators={strategy.indicators || []}
            onAdd={handleAddIndicator}
            onRemove={handleRemoveIndicator}
          />
        )
      case 2:
        return (
          <StrategyLogicForm
            entryLogic={strategy.entryLogic || ''}
            exitLogic={strategy.exitLogic || ''}
            indicators={strategy.indicators || []}
            onEntryChange={handleEntryLogicChange}
            onExitChange={handleExitLogicChange}
          />
        )
      default:
        return null
    }
  }

  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          전략 생성
        </Typography>

        <Box sx={{ width: '100%', mb: 4 }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Card>
          <CardContent>
            <Box sx={{ mt: 2, mb: 4 }}>{getStepContent(activeStep)}</Box>

            <Grid container spacing={2} justifyContent="flex-end">
              <Grid item>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                >
                  이전
                </Button>
              </Grid>
              <Grid item>
                {activeStep === steps.length - 1 ? (
                  <Button variant="contained" color="primary" onClick={handleSubmit}>
                    전략 생성
                  </Button>
                ) : (
                  <Button variant="contained" onClick={handleNext}>
                    다음
                  </Button>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </MainLayout>
  )
}

export default CreateStrategy 