import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import helperSlice from "./helperSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// redux-persist config
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

// Combine reducers (even if only one now, helps with scalability)
const rootReducer = combineReducers({
  user: userSlice,
  helper: helperSlice,
});

// Wrap with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store); // this is required for <PersistGate>
export default store;
