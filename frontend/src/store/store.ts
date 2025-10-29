// Redux Toolkit se store configure karne ke liye function import kar rahe hain
import { configureStore } from '@reduxjs/toolkit';

// RTK Query ke liye listeners setup karne ka helper (network refetching, etc.)
import { setupListeners } from '@reduxjs/toolkit/query/react';

// Redux Persist ke required functions aur constants import kar rahe hain
// Ye localStorage ya sessionStorage me Redux state ko save/reload karne ke liye use hota hai
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

// Redux Persist ka default storage (by default localStorage)
import storage from 'redux-persist/lib/storage';

// Apne custom RTK Query API services import kar rahe hain
import { api } from './api';
import { adminApi } from './adminApi';

// Alag-alag Redux slices import kar rahe hain (user, cart, wishlist, checkout)
import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import checkoutReducer from './slices/checkoutSlice';


// Ye config define karta hai ki kaunsa part Redux state ka localStorage me save hoga

// User slice ke liye config
const userPersistConfig = {
  key: 'user',               // LocalStorage me 'user' naam se data store hoga
  storage,                   // Kaha store hoga (localStorage)
  whitelist: ['user', 'isEmailVerified', 'isLoggedIn'] // Sirf ye fields save hongi
};

// Cart slice ke liye config
const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items']       // Sirf cart ke items save rahenge
};

// Wishlist aur checkout slices ke liye simple config
const wishlistPersistConfig = { key: 'wishlist', storage };
const checkoutPersistConfig = { key: 'checkout', storage };



// persistReducer() ek wrapper hai jo Redux reducer ko persist-enabled bana deta hai
// Iska matlab: ab ye reducer automatically apni state ko save aur reload karega

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedWishlistReducer = persistReducer(wishlistPersistConfig, wishlistReducer);
const persistedCheckoutReducer = persistReducer(checkoutPersistConfig, checkoutReducer);



export const store = configureStore({
  reducer: {
    // RTK Query APIs (automatic endpoints ke reducers)
    [api.reducerPath]: api.reducer,
    [adminApi.reducerPath]: adminApi.reducer,

    // Apne persisted reducers (user, cart, wishlist, checkout)
    user: persistedUserReducer,
    cart: persistedCartReducer,
    wishlist: persistedWishlistReducer,
    checkout: persistedCheckoutReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Redux Persist kuch non-serializable actions dispatch karta hai
      // Ye config unhe ignore karta hai taaki warning na aaye
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      // RTK Query ke middlewares ko add karte hain (API fetching ke liye)
      .concat(api.middleware)
      .concat(adminApi.middleware),
});


// setupListeners RTK Query ko automatically refetch karne me madad karta hai
// Jaise jab tum app wapas foreground me laate ho ya internet reconnect hota hai
setupListeners(store.dispatch);


// persistStore() ek persistor object banata hai
// Jo store ke saath milke state ko automatically save & rehydrate karta hai
export const persistor = persistStore(store);


// RootState type: store ke getState() se return hone wali complete Redux state ka type
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch type: store.dispatch ka type (used in components for proper typing)
export type AppDispatch = typeof store.dispatch;
