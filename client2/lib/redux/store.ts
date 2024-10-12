import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import appStateReducer from './appSlice'

import { authApi } from './features/auth/authApi'
import { ticketApi } from './features/tickets/ticketApi'
import { orderApi } from './features/orders/orderApi'
import { paymentApi } from './features/payments/paymentApi'
// Create the Redux store
export const store = configureStore({
	reducer: {
		[authApi.reducerPath]: authApi.reducer,
		[ticketApi.reducerPath]: ticketApi.reducer,
		[orderApi.reducerPath]: orderApi.reducer,
		[paymentApi.reducerPath]: paymentApi.reducer,
		appState: appStateReducer,
	}, // Add your reducers here
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			authApi.middleware,
			ticketApi.middleware,
			orderApi.middleware,
			paymentApi.middleware
		),
})

// Setup listeners for refetch behaviors
setupListeners(store.dispatch)

export {
	useGetUserQuery,
	useAddUserMutation,
	useLoginUserMutation,
	useLogoutMutation,
} from './features/auth/authApi'

export {
	useGetTicketsQuery,
	useGetTicketByIdQuery,
	useCreateTicketMutation,
	useUpdateTicketMutation,
	useGetUserTicketsQuery,
	useDeleteTicketMutation
} from './features/tickets/ticketApi'

export {
	useGetOrdersQuery,
	useGetOrderByIdQuery,
	useCreateOrderMutation,
	useCancelOrderMutation,
	useDeleteOrderMutation,
	useGetCompletedOrdersQuery,
} from './features/orders/orderApi'

export {
	useCreatePaymentOrderMutation,
	useVerifyPaymentMutation,
} from './features/payments/paymentApi'

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Typed versions of useDispatch and useSelector hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
