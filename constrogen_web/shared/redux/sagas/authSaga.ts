import {
  take,
  call,
  put,
  fork,
  cancel,
} from "redux-saga/effects";
import {
  checkRefetchToken,
  logoutRequest,
  refetchTokenSuccess,
  refetchTokenSuccessFailure,
  initialState,
} from "../slices/authSlice";
import { setUserProfile, clearUserProfile } from "../slices/userSlice";
import { IStorageService, StorageKeys } from "../../services/storageService";

/**
 * Create auth saga with storage dependency injection
 */
export const createAuthSaga = (storageService: IStorageService) => {
  function* verifyOtpSaga(action: any): Generator<any, void, any> {
    try {
      const { isAuthenticatedVerify = false, ...restPayload } =
        action?.payload || {};

      let authInfo = (yield call(() =>
        storageService.get(StorageKeys.AUTH_INFO)
      )) as any;

      if (authInfo === null && !isAuthenticatedVerify) {
        const isAuthenticated = true;
        authInfo = { ...restPayload, isAuthenticated };
        yield call(() => storageService.set(StorageKeys.AUTH_INFO, authInfo));
      }

      // Split tokens to auth slice
      yield put(
        refetchTokenSuccess({
          access: authInfo.access,
          refresh: authInfo.refresh,
          module_permissions: authInfo.module_permissions,
          isAuthenticated: true,
        })
      );

      // Push user profile to user slice
      if (authInfo.user) {
        yield put(setUserProfile(authInfo.user));
      }
    } catch (error: any) {
      yield put(refetchTokenSuccessFailure(error.message));
    }
  }

  function* logoutSaga(): Generator<any, void, any> {
    try {
      yield call(() => storageService.remove(StorageKeys.AUTH_INFO));
      yield put(refetchTokenSuccess(initialState));
      yield put(clearUserProfile());
    } catch (error: any) {
      yield put(refetchTokenSuccessFailure(error.message));
    }
  }

  // Watcher for checkRefetchToken
  function* watchCheckRefetchToken(): Generator<any, void, any> {
    let lastTask;
    while (true) {
      const action = yield take(checkRefetchToken.type);
      if (lastTask) {
        yield cancel(lastTask);
      }
      lastTask = yield fork(verifyOtpSaga, action);
    }
  }

  // Watcher for logoutRequest
  function* watchLogoutRequest(): Generator<any, void, any> {
    let lastTask;
    while (true) {
      yield take(logoutRequest.type);
      if (lastTask) {
        yield cancel(lastTask);
      }
      lastTask = yield fork(logoutSaga);
    }
  }

  return function* authSaga(): Generator<any, void, any> {
    yield fork(watchCheckRefetchToken);
    yield fork(watchLogoutRequest);
  };
};
