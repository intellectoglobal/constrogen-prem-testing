import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootReducer from "../../shared/redux/rootReducer";
import { createRootSaga } from "../../shared/redux/sagas/rootSaga";
import { WebStorageService } from "../../shared/services/storageService";
import type { Middleware } from "@reduxjs/toolkit";

// Initialize saga middleware
const sagaMiddleware = createSagaMiddleware();

// Create storage service instance for web
export const storageService = new WebStorageService();

// Create root saga with storage service
const rootSaga = createRootSaga(storageService);

// Create the store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware as Middleware),
});

// Run the root saga
sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;

