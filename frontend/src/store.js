import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import auth from "./reducers/auth_reducer";
import admin from "./reducers/admin_reducer";
import employee from "./reducers/employee_reducer";


const rootReducer = combineReducers({
  auth,
  admin,
  employee,
});

const initialState = {};

export default function configureStore() {
  return createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(thunkMiddleware), f => f)
  );;
}
