import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { UserResponse } from './features/auth/authApi' // Updated import
import type { RootState } from './store'

// Define the initial state using that type
type appState = {
	user: UserResponse | null
}

const initialState: appState = {
	user: null,
}


export const appState = createSlice({
	name: 'appState',
	initialState,

	reducers: {
		setCredentials: (
			state,
			{ payload }: PayloadAction<{ user: UserResponse }>
		) => {
			state.user = payload.user
		},
	},
})

export const {
    setCredentials,


} = appState.actions

export default appState.reducer

export const selectCurrentUser = (state: RootState) => state.appState.user
// delete task and board
// Selector function to retrieve variant state value


