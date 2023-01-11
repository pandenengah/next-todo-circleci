import { Action, combineReducers, configureStore, ThunkAction } from "@reduxjs/toolkit"
import { createWrapper } from "next-redux-wrapper";
import { selectedTodoSlice } from "./features/selectedTodoSlice";
import { todoSortTypeSlice } from "./features/todoSortTypeSlice";

const store = configureStore({
  reducer: {
    [selectedTodoSlice.name]: selectedTodoSlice.reducer,
    [todoSortTypeSlice.name]: todoSortTypeSlice.reducer,
  },
  devTools: true
})

// const combinedReducer = combineReducers({
//   [todoSortTypeSlice.name]: todoSortTypeSlice.reducer
// });

// const masterReducer = (state: any, action: any) => {
//   if (action.type === 'HYDRATE') {
//     const nextState = {
//       ...state, // use previous state
//       [todoSortTypeSlice.name]: {
//         value: action.payload.todoSortType.value,
//       },
//     }
//     return nextState;
//   }
//   else {
//     return combinedReducer(state, action)
//   }
// }

// const store = configureStore({
//   reducer: masterReducer,
//   devTools: true
// })

const makeStore = () => {
  return store
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;
export type AppDispatch = typeof store.dispatch

export const wrapper = createWrapper<AppStore>(makeStore, { debug: true });
