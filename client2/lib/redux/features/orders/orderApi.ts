import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { get } from 'http'

export interface Order {
	id?: string
	status?: string
	expiresAt?: string
	ticket: {
		id: string
		title: string
		price: number
	}
	userId?: string
	version?: number
}

const orderApi = createApi({
	reducerPath: 'orderApi',
	baseQuery: fetchBaseQuery({
		baseUrl: '/',
		credentials: 'include',
		mode: 'cors',
	}),
	tagTypes: ['Order', 'Orders'], // Define tag types for cache management
	endpoints(builder) {
		return {
			// Fetch a list of orders for the authenticated user
			getOrders: builder.query<Order[], void>({
				query: () => ({
					url: '/api/orders',
					method: 'GET',
				}),
				providesTags: (result) =>
					result
						? [
								...result.map(({ id }) => ({ type: 'Order', id } as const)),
								{ type: 'Orders', id: 'LIST' },
						  ]
						: [{ type: 'Orders', id: 'LIST' }],
			}),
			getCompletedOrders: builder.query<Order[], void>({
				query: () => ({
					url: '/api/orders/completed',
					method: 'GET',
				}),
				providesTags: (result) =>
					result
						? [
								...result.map(({ id }) => ({ type: 'Order', id } as const)),
								{ type: 'Orders', id: 'LIST' },
						  ]
						: [{ type: 'Orders', id: 'LIST' }],
			}),

			// Fetch a specific order by ID
			getOrderById: builder.query<Order, string>({
				query: (id) => ({
					url: `/api/orders/${id}`,
					method: 'GET',
				}),
				providesTags: (result, error, id) => [{ type: 'Order', id }],
			}),

			// Create a new order
			createOrder: builder.mutation<Order, { ticketId: string }>({
				query: (orderData) => ({
					url: '/api/orders',
					method: 'POST',
					body: orderData,
				}),
				invalidatesTags: [{ type: 'Orders', id: 'LIST' }],
			}),

			// Cancel an order by ID (updating its status to cancelled)
			cancelOrder: builder.mutation<void, string>({
				query: (id) => ({
					url: `/api/orders/${id}`,
					method: 'DELETE',
				}),
				invalidatesTags: (result, error, id) => [{ type: 'Order', id }],
			}),
			deleteOrder: builder.mutation<void, string>({
				query: (id) => ({
					url: `/api/orders/${id}`,
					method: 'DELETE',
				}),
				invalidatesTags: (result, error, id) => [{ type: 'Order', id }],
			}),
		}
	},
})

export const {
	useGetOrdersQuery,
	useGetOrderByIdQuery,
	useCreateOrderMutation,
	useCancelOrderMutation,
	useDeleteOrderMutation,
	useGetCompletedOrdersQuery,
} = orderApi

export { orderApi }
