'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, setCredentials } from '@/lib/redux/appSlice'
import { useGetUserQuery } from '@/lib/redux/store'

export default function Home() {
	const { data: userData } = useGetUserQuery()
	const dispatch = useDispatch()

	// Set user credentials if available
	useEffect(() => {
		if (userData?.currentUser) {
			dispatch(setCredentials({ user: userData.currentUser }))
		}
	}, [userData, dispatch])

	const user = useSelector(selectCurrentUser)

	if (!user) {
		return (
			<div role="status">
				<p className="px-8 text-center text-sm text-muted-foreground">
					to view your tasks{' '}
					<Link
						href="/auth/signin"
						className="underline underline-offset-4 hover:text-primary text-blue-500"
					>
						Sign-In
					</Link>
				</p>
			</div>
		)
	}

	return (
		<>
			<div className="space-y-6">
				<div>something something</div>
			</div>
		</>
	)
}
