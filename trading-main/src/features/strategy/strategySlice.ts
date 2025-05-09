import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Strategy, BacktestResult, BacktestConfig } from '../../types/strategy';
import { api } from '../../services/api';
import { getFromLocalStorage, saveToLocalStorage } from '../../utils/localStorage';

// 로컬 스토리지 키
const STRATEGIES_KEY = 'trading_strategies';
const CURRENT_STRATEGY_KEY = 'current_strategy';
const BACKTEST_RESULTS_KEY = 'backtest_results';

// Mock API 함수 (백엔드 없이 로컬 스토리지를 사용)
const mockApi = {
  async getStrategies(): Promise<Strategy[]> {
    return getFromLocalStorage<Strategy[]>(STRATEGIES_KEY, []);
  },

  async createStrategy(strategy: Omit<Strategy, 'id'>): Promise<Strategy> {
    const strategies = getFromLocalStorage<Strategy[]>(STRATEGIES_KEY, []);
    const newStrategy: Strategy = {
      ...strategy,
      id: Date.now().toString(),
      metadata: {
        ...strategy.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      isValid: false,
    };
    strategies.push(newStrategy);
    saveToLocalStorage(STRATEGIES_KEY, strategies);
    return newStrategy;
  },

  async validateStrategy(strategyId: string): Promise<Strategy> {
    const strategies = getFromLocalStorage<Strategy[]>(STRATEGIES_KEY, []);
    const index = strategies.findIndex(s => s.id === strategyId);
    if (index === -1) {
      throw new Error('전략을 찾을 수 없습니다');
    }
    
    strategies[index].isValid = true;
    saveToLocalStorage(STRATEGIES_KEY, strategies);
    return strategies[index];
  },

  async runBacktest(config: BacktestConfig): Promise<BacktestResult> {
    const strategies = getFromLocalStorage<Strategy[]>(STRATEGIES_KEY, []);
    const strategy = strategies.find(s => s.id === config.strategyId);
    if (!strategy) {
      throw new Error('전략을 찾을 수 없습니다');
    }

    // 예시 데이터 생성
    const result: BacktestResult = {
      strategyId: config.strategyId,
      totalReturn: Math.random() * 0.5, // 0~50% 사이 랜덤 수익률
      annualizedReturn: Math.random() * 0.3, // 0~30% 사이 랜덤 연간 수익률
      maxDrawdown: Math.random() * 0.2, // 0~20% 사이 랜덤 낙폭
      sharpeRatio: 0.5 + Math.random() * 2, // 0.5~2.5 사이 랜덤 샤프 비율
      trades: generateMockTrades(config),
      equityCurve: generateMockEquityCurve(config),
      runDate: new Date(),
      symbol: config.symbol,
    };

    saveToLocalStorage(BACKTEST_RESULTS_KEY, result);
    return result;
  },
};

// 예시 거래 데이터 생성 함수
function generateMockTrades(config: BacktestConfig) {
  const trades = [];
  const startDate = new Date(config.startDate);
  const endDate = new Date(config.endDate);
  const duration = endDate.getTime() - startDate.getTime();
  
  // 10~20개 정도의 거래 생성
  const tradeCount = 10 + Math.floor(Math.random() * 10);
  const initialPrice = 10000 + Math.random() * 40000; // 시작 가격 (BTC의 경우)
  
  for (let i = 0; i < tradeCount; i++) {
    const entryDate = new Date(startDate.getTime() + Math.random() * duration * 0.8);
    const exitDate = new Date(entryDate.getTime() + Math.random() * (endDate.getTime() - entryDate.getTime()));
    
    const direction = Math.random() > 0.5 ? 'long' as const : 'short' as const;
    const entryPrice = initialPrice * (1 + (Math.random() * 0.4 - 0.2)); // +/-20%
    const exitPrice = entryPrice * (1 + (Math.random() * 0.3 - 0.15)); // +/-15%
    
    const profit = direction === 'long' 
      ? exitPrice - entryPrice 
      : entryPrice - exitPrice;
    const profitPercentage = direction === 'long'
      ? (exitPrice - entryPrice) / entryPrice
      : (entryPrice - exitPrice) / entryPrice;
    
    trades.push({
      entryDate,
      entryPrice,
      exitDate,
      exitPrice,
      profit,
      profitPercentage,
      direction,
    });
  }
  
  // 날짜 순으로 정렬
  return trades.sort((a, b) => a.entryDate.getTime() - b.entryDate.getTime());
}

// 예시 자산 곡선 데이터 생성 함수
function generateMockEquityCurve(config: BacktestConfig) {
  const curve = [];
  const startDate = new Date(config.startDate);
  const endDate = new Date(config.endDate);
  const duration = endDate.getTime() - startDate.getTime();
  
  // 매일 자산 데이터 생성
  const initialEquity = config.initialCapital;
  let currentEquity = initialEquity;
  
  // 30일 단위로 샘플링 (데이터 양 줄이기)
  const samplingPeriod = duration / 30;
  
  for (let i = 0; i <= 30; i++) {
    const date = new Date(startDate.getTime() + i * samplingPeriod);
    
    // 랜덤한 자산 변화 (트렌드 추가)
    const trend = Math.random() > 0.7 ? 1 : -1;
    const change = Math.random() * 0.05 * trend; // +/-5% 변화
    currentEquity = currentEquity * (1 + change);
    
    curve.push({
      date,
      equity: currentEquity,
    });
  }
  
  return curve;
}

interface StrategyState {
  strategies: Strategy[];
  currentStrategy: Strategy | null;
  backtestResults: BacktestResult | null;
  isLoading: boolean;
  error: string | null;
}

// 초기 상태를 로컬 스토리지에서 로드
const initialState: StrategyState = {
  strategies: getFromLocalStorage<Strategy[]>(STRATEGIES_KEY, []),
  currentStrategy: getFromLocalStorage<Strategy | null>(CURRENT_STRATEGY_KEY, null),
  backtestResults: getFromLocalStorage<BacktestResult | null>(BACKTEST_RESULTS_KEY, null),
  isLoading: false,
  error: null,
};

// 비동기 액션 생성
export const fetchStrategies = createAsyncThunk(
  'strategy/fetchStrategies',
  async (_, { rejectWithValue }) => {
    try {
      return await mockApi.getStrategies();
    } catch (error) {
      return rejectWithValue('전략 목록을 불러오는데 실패했습니다.');
    }
  }
);

export const createStrategy = createAsyncThunk(
  'strategy/createStrategy',
  async (strategy: Omit<Strategy, 'id'>, { rejectWithValue }) => {
    try {
      return await mockApi.createStrategy(strategy);
    } catch (error) {
      return rejectWithValue('전략 생성에 실패했습니다.');
    }
  }
);

export const validateStrategy = createAsyncThunk(
  'strategy/validateStrategy',
  async (strategyId: string, { rejectWithValue }) => {
    try {
      return await mockApi.validateStrategy(strategyId);
    } catch (error) {
      return rejectWithValue('전략 검증에 실패했습니다.');
    }
  }
);

export const runBacktest = createAsyncThunk(
  'strategy/runBacktest',
  async (config: BacktestConfig, { rejectWithValue }) => {
    try {
      return await mockApi.runBacktest(config);
    } catch (error) {
      return rejectWithValue('백테스트 실행에 실패했습니다.');
    }
  }
);

const strategySlice = createSlice({
  name: 'strategy',
  initialState,
  reducers: {
    setCurrentStrategy: (state, action: PayloadAction<Strategy | null>) => {
      state.currentStrategy = action.payload;
      saveToLocalStorage(CURRENT_STRATEGY_KEY, action.payload);
    },
    clearBacktestResults: (state) => {
      state.backtestResults = null;
      saveToLocalStorage(BACKTEST_RESULTS_KEY, null);
    },
  },
  extraReducers: (builder) => {
    builder
      // 전략 목록 가져오기
      .addCase(fetchStrategies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStrategies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.strategies = action.payload;
        saveToLocalStorage(STRATEGIES_KEY, action.payload);
      })
      .addCase(fetchStrategies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 전략 생성
      .addCase(createStrategy.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createStrategy.fulfilled, (state, action) => {
        state.isLoading = false;
        state.strategies.push(action.payload);
        state.currentStrategy = action.payload;
        
        saveToLocalStorage(STRATEGIES_KEY, state.strategies);
        saveToLocalStorage(CURRENT_STRATEGY_KEY, action.payload);
      })
      .addCase(createStrategy.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 전략 검증
      .addCase(validateStrategy.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(validateStrategy.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentStrategy = action.payload;
        
        const index = state.strategies.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.strategies[index] = action.payload;
        }
        
        saveToLocalStorage(STRATEGIES_KEY, state.strategies);
        saveToLocalStorage(CURRENT_STRATEGY_KEY, action.payload);
      })
      .addCase(validateStrategy.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 백테스트 실행
      .addCase(runBacktest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(runBacktest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.backtestResults = action.payload;
        saveToLocalStorage(BACKTEST_RESULTS_KEY, action.payload);
      })
      .addCase(runBacktest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentStrategy, clearBacktestResults } = strategySlice.actions;
export default strategySlice.reducer; 