import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { authApi } from './features/auth/authApi'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import appStateReducer from './appSlice'

// Create the Redux store
export const store = configureStore({
	reducer: {
		[authApi.reducerPath]: authApi.reducer,
        appState: appStateReducer,


	}, // Add your reducers here
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(authApi.middleware),
})

// Setup listeners for refetch behaviors
setupListeners(store.dispatch)

export {
    useGetUserQuery,
	useAddUserMutation,
	useLoginUserMutation,
	useLogoutMutation,
} from './features/auth/authApi'

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


// Typed versions of useDispatch and useSelector hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector