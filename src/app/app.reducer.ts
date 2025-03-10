import { IAppActions, IAppReducerState } from './app.model'

export const initialState: IAppReducerState = {
  sessionInfo: {
    userId: localStorage.getItem('userId') ?? null,
    sessionStarted: localStorage.getItem('sessionStarted') ?? null,
  },
}

export const AppReducer = (
  state: IAppReducerState = initialState,
  action: IAppActions,
): IAppReducerState => {
  switch (action.type) {
  case '@@app/SET_SESSION':
    return {
      ...state,
      sessionInfo: {
        ...state.sessionInfo,
        userId: action.payload.userId || null,
        sessionStarted: action.payload.sessionStarted || null,
      },
    }
  default:
    return state
  }
}
