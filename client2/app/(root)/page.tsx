'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useEffect } from 'react'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, setCredentials } from '@/lib/redux/appSlice'
import { useGetUserQuery, useGetTicketsQuery } from '@/lib/redux/store'
import EventTicketCard from '@/components/cards/EventTicketCard'
import { useRouter } from 'next/navigation'

const categories = [
	{ name: 'Music', icon: '🎵' },
	{ name: 'Sports', icon: '⚽' },
	{ name: 'Arts', icon: '🎨' },
	{ name: 'Food', icon: '🍔' },
	{ name: 'Technology', icon: '💻' },
	{ name: 'Business', icon: '💼' },
]

export default function LandingPage() {
	const router = useRouter()
	const { data: userData, isLoading: userLoading } = useGetUserQuery()
	const dispatch = useDispatch()
	const { data: ticketsData, isLoading: ticketsLoading } = useGetTicketsQuery()

	// Set user credentials if available
	useEffect(() => {
		if (userData?.currentUser) {
			dispatch(setCredentials({ user: userData.currentUser }))
		}
	}, [userData, dispatch])

	const user = useSelector(selectCurrentUser)

	// Handle redirect inside useEffect
	useEffect(() => {
		// Wait until the userData is no longer loading before deciding on redirect
		if (!userLoading && !userData?.currentUser) {
			router.push(`/auth/signin`)
		}
	}, [user, userLoading, userData, router])

	// Conditional render if user is not yet defined
	if (userLoading) {
		// While user data is loading, display a loading indicator or message
		return <p>Loading...</p>
	}

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
		<div className="min-h-screen bg-[#0a0a0a] text-gray-100">
			<main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
				<h1 className="text-3xl font-bold mb-8">Discover Events</h1>

				<section className="mb-12">
					<h2 className="text-2xl font-semibold mb-4">Categories</h2>
					<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
						{categories.map((category) => (
							<Card
								key={category.name}
								className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors"
							>
								<CardContent className="p-3 flex flex-col items-center justify-center h-20">
									<span className="text-2xl mb-1">{category.icon}</span>
									<h3 className="font-semibold text-center text-xs">
										{category.name}
									</h3>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">Trending Events</h2>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{ticketsLoading || !ticketsData || ticketsData.length === 0 ? (
							<div className="w-full">
								<h2 className="text-center text-lg text-gray-400">
									No tickets right now
								</h2>
								<p>
									<Link href="/tickets/create">
										<p className="text-center text-lg text-blue-400">
											Create a ticket
										</p>
									</Link>
								</p>
							</div>
						) : (
							ticketsData?.map((event) => (
								<EventTicketCard
									key={event.id}
									title={event.title}
									id={event.id}
								/>
							))
						)}
					</div>
				</section>
			</main>
		</div>
	)
}
