'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarIcon, MapPinIcon, TicketIcon, StarIcon } from 'lucide-react'

export default function UserProfilePage() {
	const [activeTab, setActiveTab] = useState('upcoming')

	const user = {
		name: 'Alex Johnson',
		username: '@alexj',
		bio: 'Event enthusiast | Music lover | Always ready for the next big show',
		location: 'New York, NY',
		memberSince: 'January 2022',
		eventsAttended: 37,
		avatar: '/placeholder.svg',
	}

	const upcomingEvents = [
		{
			id: 1,
			name: 'Cosmic Symphony',
			date: '2024-08-15',
			venue: 'Stellar Hall',
			ticketType: 'VIP',
		},
		{
			id: 2,
			name: 'Rock the Universe',
			date: '2024-09-22',
			venue: 'Galaxy Arena',
			ticketType: 'General',
		},
		{
			id: 3,
			name: 'Jazz Under the Stars',
			date: '2024-10-05',
			venue: 'Moonlight Garden',
			ticketType: 'Premium',
		},
	]

	const pastEvents = [
		{
			id: 4,
			name: 'Electronica Fest',
			date: '2024-05-10',
			venue: 'Neon Stadium',
			ticketType: 'VIP',
		},
		{
			id: 5,
			name: 'Classical Nights',
			date: '2024-06-18',
			venue: 'Harmony Theater',
			ticketType: 'General',
		},
		{
			id: 6,
			name: 'Summer Vibes Concert',
			date: '2024-07-03',
			venue: 'Beachside Arena',
			ticketType: 'Premium',
		},
	]

	return (
		<div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-4 md:p-8 lg:p-12">
			<Card className="w-full bg-black/10 backdrop-blur-md border border-white/10 shadow-lg">
				<CardHeader className="pb-0">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between">
						<div className="flex items-center space-x-4">
							<Avatar className="w-20 h-20 border-2 border-white/20">
								<AvatarImage src={user.avatar} alt={user.name} />
								<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
							</Avatar>
							<div>
								<h1 className="text-2xl font-bold text-white">{user.name}</h1>
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
								onClick={() => setActiveTab('upcoming')}
								className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-md transition-all"
							>
								Upcoming Events
							</TabsTrigger>
							<TabsTrigger
								value="past"
								onClick={() => setActiveTab('past')}
								className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-md transition-all"
							>
								Past Events
							</TabsTrigger>
						</TabsList>
						<TabsContent value="upcoming">
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								{upcomingEvents.map((event) => (
									<EventCard key={event.id} event={event} isPast={false} />
								))}
							</div>
						</TabsContent>
						<TabsContent value="past">
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								{pastEvents.map((event) => (
									<EventCard key={event.id} event={event} isPast={true} />
								))}
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	)
}

function EventCard({ event, isPast }) {
	return (
		<Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
			<CardContent className="p-4">
				<div className="flex flex-col h-full">
					<div>
						<h3 className="text-lg font-semibold text-white mb-2">
							{event.name}
						</h3>
						<div className="flex items-center space-x-2 text-sm text-gray-400 mb-1">
							<CalendarIcon className="w-4 h-4 flex-shrink-0" />
							<span>
								{new Date(event.date).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</span>
						</div>
						<div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
							<MapPinIcon className="w-4 h-4 flex-shrink-0" />
							<span>{event.venue}</span>
						</div>
					</div>
					<div className="mt-auto flex items-center justify-between">
						<Badge
							variant="secondary"
							className="bg-white/10 text-white backdrop-blur-sm"
						>
							{event.ticketType}
						</Badge>
						{isPast ? (
							<Button
								variant="outline"
								size="sm"
								className="text-black border-white/20 hover:bg-white/10 backdrop-blur-sm"
							>
								<StarIcon className="w-4 h-4 mr-1 text-black" /> Rate
							</Button>
						) : (
							<Button
								variant="outline"
								size="sm"
								className="text-black font-bold border-white/20 hover:bg-white/10 backdrop-blur-sm"
							>
								<TicketIcon className="w-4 h-4 mr-1 text-black" /> View Ticket
							</Button>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
