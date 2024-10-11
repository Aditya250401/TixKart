import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Ticket {
	id?: string
	title: string
	price: number
	userId?: string
	version?: number
}

const ticketApi = createApi({
	reducerPath: 'ticketApi',
	baseQuery: fetchBaseQuery({
		baseUrl: '/',
		credentials: 'include',
		mode: 'cors',
	}),
	tagTypes: ['Ticket', 'Tickets'], // Define tag types for cache management
	endpoints(builder) {
		return {
			// Fetch a list of available tickets
			getTickets: builder.query<Ticket[], void>({
				query: () => ({
					url: '/api/tickets',
					method: 'GET',
				}),
				providesTags: (result) =>
					result
						? [
								...result.map(({ id }) => ({ type: 'Ticket', id } as const)),
								{ type: 'Tickets', id: 'LIST' },
						  ]
						: [{ type: 'Tickets', id: 'LIST' }],
			}),
			// Fetch a list of tickets for the authenticated user
			getUserTickets: builder.query<Ticket[], void>({
				query: () => ({
					url: '/api/ticketsUser',
					method: 'GET',
				}),
				providesTags: (result) =>
					result
						? [
								...result.map(({ id }) => ({ type: 'Ticket', id } as const)),
								{ type: 'Tickets', id: 'LIST' },
						  ]
						: [{ type: 'Tickets', id: 'LIST' }],
			}),

			// Fetch a specific ticket by id
			getTicketById: builder.query<Ticket, string>({
				query: (id) => ({
					url: `/api/tickets/${id}`,
					method: 'GET',
				}),
				providesTags: (result, error, id) => [{ type: 'Ticket', id }],
			}),

			// Create a new ticket
			createTicket: builder.mutation<Ticket, { title: string; price: number }>({
				query: (ticketData) => ({
					url: '/api/tickets',
					method: 'POST',
					body: ticketData,
				}),
				invalidatesTags: [{ type: 'Tickets', id: 'LIST' }], // Invalidate the ticket list to refresh it
			}),

			// Update an existing ticket
			updateTicket: builder.mutation<
				Ticket,
				{ id: string; title: string; price: number }
			>({
				query: ({ id, ...updateData }) => ({
					url: `/api/tickets/${id}`,
					method: 'PUT',
					body: updateData,
				}),
				invalidatesTags: (result, error, { id }) => [{ type: 'Ticket', id }],
			}),
		}
	},
})

export const {
	useGetTicketsQuery,
	useGetTicketByIdQuery,
	useCreateTicketMutation,
	useUpdateTicketMutation,
	useGetUserTicketsQuery,
} = ticketApi

export { ticketApi }
