export interface StrategyMetadata {
  id?: string;
  name: string;
  developer: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Indicator {
  id?: string;
  name: string;
  description: string;
  code: string;
  isSystemBuiltin: boolean;
}

export interface Strategy {
  id?: string;
  metadata: StrategyMetadata;
  indicators: Indicator[];
  entryLogic: string;
  exitLogic: string;
  isValid?: boolean;
}

export interface BacktestConfig {
  strategyId: string;
  startDate: Date;
  endDate: Date;
  initialCapital: number;
  symbol: string;
  timeframe: string;
  isDemo: boolean;
  isBacktest: boolean;
  isLive: boolean;
}

export interface BacktestResult {
  strategyId: string;
  totalReturn: number;
  annualizedReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  trades: BacktestTrade[];
  equityCurve: EquityPoint[];
  runDate?: Date;
  symbol?: string;
}

export interface BacktestTrade {
  entryDate: Date;
  entryPrice: number;
  exitDate: Date;
  exitPrice: number;
  profit: number;
  profitPercentage: number;
  direction: 'long' | 'short';
}

export interface EquityPoint {
  date: Date;
  equity: number;
} 