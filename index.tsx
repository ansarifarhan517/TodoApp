// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './src/app'
import { Provider } from 'react-redux'
import store from '@redux/store'

const rootElement = document.getElementById('app')

if (rootElement) {
  const root = createRoot(rootElement)
  root.render(<Provider store={store}>
    <App />
  </Provider>)
}
