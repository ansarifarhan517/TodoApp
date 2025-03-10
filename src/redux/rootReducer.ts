import { combineReducers } from 'redux'
import { useSelector, TypedUseSelectorHook } from 'react-redux'
import { AppReducer } from '../../src/app/app.reducer'
import { TodoReducer } from '../../src/pages/todo/todo.reducer'

const rootReducer = combineReducers({
  App: AppReducer,
  Todo: TodoReducer,
})

export type AppState = ReturnType<typeof rootReducer>;

export const useTypedSelector: TypedUseSelectorHook<AppState> = useSelector
export default rootReducer
