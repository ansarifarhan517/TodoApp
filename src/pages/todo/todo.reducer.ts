import { ITodoActions, ITodoReducerState } from './todo.model'

export const initialState: ITodoReducerState = {
    isFavTodosButton: false
}

export const TodoReducer = (
    state: ITodoReducerState = initialState,
    action: ITodoActions,
): ITodoReducerState => {
    switch (action.type) {
        case '@@todo/SET_TOGGLE_FAV_TODO_BUTTON':
            return {
                ...state,
                isFavTodosButton: action.payload.isFavTodosButton
            }
        default:
            return state
    }
}
