import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { Todo } from "../../models/todo.interface";
import { AppState } from "../store";


interface LocalState {
  value: Todo
}

const initialState: LocalState = {
  value: {},
}

export const selectedTodoSlice = createSlice({
  name: 'selectedTodo',
  initialState,
  reducers: {
    setSelectedTodo: (state, action: PayloadAction<Todo>) => {
      state.value = action.payload
    },
  },
  extraReducers: builder => {
    builder.addCase(HYDRATE, (state, action: any) => {
      return {
        ...state,
        ...action.payload.selectedTodo,
      };
    })
  }
})

export const {setSelectedTodo} = selectedTodoSlice.actions
export let getSelectedTodo = (state: AppState) => state.selectedTodo.value
export default selectedTodoSlice.reducer
