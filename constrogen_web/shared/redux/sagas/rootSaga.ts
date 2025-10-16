import { call, fork } from "redux-saga/effects";
import { IStorageService } from "../../services/storageService";
import { createAuthSaga } from "./authSaga";

/**
 * Create root saga with storage dependency injection
 */
export const createRootSaga = (storageService: IStorageService) => {
  const authSaga = createAuthSaga(storageService);

  return function* rootSaga() {
    yield call(function* () {
      yield fork(authSaga);
    });
  };
};

