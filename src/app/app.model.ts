export interface IAppReducerState {
    sessionInfo: {
      userId: string | null;
      sessionStarted: string | null;
    };
  }

export interface IAppSetSession {
    readonly type: '@@app/SET_SESSION';
    payload: {
      userId: string;
      sessionStarted: string;
    };
  }

export interface IResetState {
    readonly type: '@@app/RESET_INITIAL_STATE';
}

export type IAppActions = IAppSetSession
