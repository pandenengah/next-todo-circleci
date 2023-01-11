import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "../store";

interface LocalState {
  value: string
}

const initialState: LocalState = {
  value: 'asc',
}

export const todoSortTypeSlice = createSlice({
  name: 'todoSortType',
  initialState,
  reducers: {
    setTodoSortType: (state, action: PayloadAction<string>) => {
      state.value = action.payload
    }
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.todoSortType,
      };
    },
  }
})

export const { setTodoSortType } = todoSortTypeSlice.actions
export const getTodoSortType = (state: AppState) => state.todoSortType.value
export default todoSortTypeSlice.reducer
