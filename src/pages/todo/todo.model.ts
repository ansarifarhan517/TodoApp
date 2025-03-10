export interface ITodoReducerState {
    isFavTodosButton: boolean
}

export interface ITodoSetSession {
    readonly type: '@@todo/SET_TOGGLE_FAV_TODO_BUTTON';
    payload: {
        isFavTodosButton: boolean;
    };
}

export type ITodoActions =  ITodoSetSession
