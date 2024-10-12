'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarIcon, MapPinIcon, Trash2 } from 'lucide-react'
import {
	useGetCompletedOrdersQuery,
	useGetUserTicketsQuery,
	useGetUserQuery,
	useDeleteTicketMutation,
} from '@/lib/redux/store'
import { useToast } from '@/hooks/use-toast'

export default function UserProfilePage() {
	const { data: mainUser } = useGetUserQuery()
	const { data: userCreatedTicketsData } = useGetUserTicketsQuery()
	const { data: userBoughtOrdersData } = useGetCompletedOrdersQuery()

	const user = {
		username: '@alexj',
		bio: 'Event enthusiast | Music lover | Always ready for the next big show',
		location: 'New York, NY',
		memberSince: 'January 2022',
		eventsAttended: userBoughtOrdersData?.length || 0,
		avatar: '/placeholder.svg',
	}

	return (
		<div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-4 md:p-8 lg:p-12">
			<Card className="w-full bg-black/10 backdrop-blur-md border border-white/10 shadow-lg">
				<CardHeader className="pb-0">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between">
						<div className="flex items-center space-x-4">
							<Avatar className="w-20 h-20 border-2 border-white/20">
								<AvatarImage
									src={user.avatar}
									alt={mainUser?.currentUser.email}
								/>
								<AvatarFallback>
									{mainUser?.currentUser.email.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div>
								<h1 className="text-2xl font-bold text-white">
									{mainUser?.currentUser.email}
								</h1>
								<p className="text-gray-400">{user.username}</p>
							</div>
						</div>
						<div className="mt-4 md:mt-0 bg-white/5 backdrop-blur-md rounded-lg p-4 text-center">
							<p className="text-3xl font-bold text-white">
								{user.eventsAttended}
							</p>
							<p className="text-sm text-gray-400">Events Attended</p>
						</div>
					</div>
				</CardHeader>
				<CardContent className="pt-6">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
						<div className="lg:col-span-2">
							<p className="text-gray-300 mb-4">{user.bio}</p>
							<div className="flex items-center space-x-2 text-sm text-gray-400">
								<MapPinIcon className="w-4 h-4" />
								<span>{user.location}</span>
							</div>
							<div className="flex items-center space-x-2 text-sm text-gray-400 mt-2">
								<CalendarIcon className="w-4 h-4" />
								<span>Member since {user.memberSince}</span>
							</div>
						</div>
					</div>

					<Tabs defaultValue="upcoming" className="w-full">
						<TabsList className="grid w-full grid-cols-2 bg-white/5 backdrop-blur-md rounded-lg p-1">
							<TabsTrigger
								value="upcoming"
								className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-md transition-all"
							>
								Created Tickets
							</TabsTrigger>
							<TabsTrigger
								value="past"
								className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-md transition-all"
							>
								Purchased Tickets
							</TabsTrigger>
						</TabsList>
						<TabsContent value="upcoming">
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								{userCreatedTicketsData?.map((ticket) => (
									<EventCard
										key={ticket.id}
										event={ticket}
										isPurchased={false}
									/>
								))}
							</div>
						</TabsContent>
						<TabsContent value="past">
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								{userBoughtOrdersData?.map((order) => (
									<EventCard
										key={order.id}
										event={order.ticket}
										isPurchased={true}
									/>
								))}
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	)
}

function EventCard({ event, isPurchased }) {
	const {toast} = useToast()
	const [deleteTicket] = useDeleteTicketMutation()

	const handleDeleteTicket = async (id) => {
		try{
			await deleteTicket(id)
		} catch (error) {
			console.log(error)
			toast({
				title: 'Error',
				description: `Failed to delete ticket:`,
				variant: 'destructive',
		})

	}}
	return (
		<Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
			<CardContent className="p-4">
				<div className="flex flex-col h-full">
					<div>
						<h3 className="text-lg font-semibold text-white mb-2">
							{event.title}
						</h3>
						<div className="flex items-center space-x-2 text-sm text-gray-400 mb-1">
							<CalendarIcon className="w-4 h-4 flex-shrink-0" />
							<span>
								{new Date(event.expiresAt || event.date).toLocaleDateString(
									'en-US',
									{
										year: 'numeric',
										month: 'long',
										day: 'numeric',
									}
								)}
							</span>
						</div>
						<div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
							<MapPinIcon className="w-4 h-4 flex-shrink-0" />
							<span>{event.venue || 'N/A'}</span>
						</div>
					</div>
					<div className="mt-auto flex items-center justify-between">
						<Badge
							variant="secondary"
							className="bg-white/10 text-white backdrop-blur-sm"
						>
							${event.price}
						</Badge>
						{!isPurchased && (
							<Button
								onClick={() => handleDeleteTicket(event.id)}
								variant="outline"
								size="sm"
								className="text-white border-white/20 hover:bg-white/10 backdrop-blur-sm"
							>
								<Trash2 className="w-4 h-4 mr-1 text-white" /> Delete
							</Button>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
