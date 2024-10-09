import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface User {
	email: string
	password?: string | undefined
}

export type UserResponse = {
	id: string
	email: string
}

export type currentUserResponse = {
	currentUser: UserResponse
}

const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: fetchBaseQuery({
		baseUrl: '/',
		credentials: 'include',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
		},
	}),

	endpoints(builder) {
		return {
			getUser: builder.query<currentUserResponse, void>({
				query: () => {
					return {
						url: '/api/users/currentuser',
						method: 'GET',
					}
				},
			}),
			addUser: builder.mutation<UserResponse, User>({
				query: (user) => {
					return {
						url: '/api/users/signup',
						method: 'POST',
						body: {
							email: user.email,
							password: user.password,
						},
					}
				},
			}),
			loginUser: builder.mutation({
				query: (user) => {
					return {
						url: '/api/users/signin',
						method: 'POST',
						body: {
							email: user.email,
							password: user.password,
						},
					}
				},
			}),
			logout: builder.mutation({
				query: () => {
					return {
						url: '/api/users/signout',
						method: 'POST',
					}
				},
			}),
		}
	},
})

export const {
	useGetUserQuery,
	useAddUserMutation,
	useLoginUserMutation,
	useLogoutMutation,
} = authApi
export { authApi }
