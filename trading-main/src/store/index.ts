import { configureStore } from '@reduxjs/toolkit'
import strategyReducer from '../features/strategy/strategySlice'

export const store = configureStore({
  reducer: {
    strategy: strategyReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 