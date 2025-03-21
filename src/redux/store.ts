import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './rootReducer'
import rootSaga from './rootSaga'

const sagaMiddleware = createSagaMiddleware()
// @ts-expect-error will fix later
const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware),
)
sagaMiddleware.run(rootSaga)
export type AppDispatch = typeof store.dispatch;

export default store
