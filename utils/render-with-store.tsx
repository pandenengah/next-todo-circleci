import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'
import { AppState, reducers } from '../stores/store'
import { ReactElement } from 'react'

const testStore = (state: Partial<AppState>) => {
  return configureStore({
    reducer: reducers,
    preloadedState: state
  })
}

export const renderWithStore = (component: ReactElement, initialState: AppState) => {
  const Wrapper = ({ children }: { children: ReactElement}) => (
    <Provider store={testStore(initialState)}>
      {children}
    </Provider>
  )
  return render(component, { wrapper: Wrapper })
}

