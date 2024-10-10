'use client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Star, CalendarIcon, MapPinIcon, Clock, Ticket } from 'lucide-react'
import { useGetTicketsQuery } from '@/lib/redux/store'
import { useRouter } from 'next/navigation'

const categories = [
	{ name: 'Music', icon: '🎵' },
	{ name: 'Sports', icon: '⚽' },
	{ name: 'Arts', icon: '🎨' },
	{ name: 'Food', icon: '🍔' },
	{ name: 'Technology', icon: '💻' },
	{ name: 'Business', icon: '💼' },
]

function EventTicketCard({
	title,
	id,
}: {
	title: string
	id: string | undefined
}) {
	const router = useRouter() // useRouter hook for client-side navigation
	const date = 'Aug 8, 2024'
	const time = '10:00 AM'
	const venue = 'Modern Art Museum'
	const category = 'Arts'
	const rating = 3

	const getFontSize = (title: string) => {
		if (title.length <= 20) return 'text-xl'
		if (title.length <= 30) return 'text-lg'
		return 'text-base'
	}

	const handleOnClick = (id: string | undefined) => {
		if (id) {
			router.push(`/tickets/${id}`) // Use router.push for navigation
		}
	}

	return (
		<div className="flex bg-white/5 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden hover:bg-white/10 transition-colors">
			<div className="flex-grow p-4 flex flex-col">
				<div className="flex items-center mb-2">
					{[...Array(5)].map((_, i) => (
						<Star
							key={i}
							className={`w-4 h-4 ${
								i < rating ? 'text-white' : 'text-gray-600'
							}`}
						/>
					))}
				</div>
				<div className="flex-grow flex space-x-4">
					<Image
						src="/assets/images/poster.png"
						alt={title}
						width={80}
						height={120}
						className="rounded-md object-cover w-20 h-30 flex-shrink-0"
					/>
					<div className="flex flex-col justify-center">
						<h3
							className={`font-bold leading-tight ${getFontSize(
								title
							)} line-clamp-2`}
						>
							{title}
						</h3>
						<div className="flex items-center mt-2 text-sm text-gray-400">
							<CalendarIcon className="w-4 h-4 mr-1" />
							{date}
						</div>
					</div>
				</div>
			</div>
			<div className="w-1/3 border-l border-white/10 p-4 flex flex-col justify-between">
				<div className="space-y-3 text-sm">
					<div className="flex items-center text-gray-400">
						<Clock className="w-4 h-4 mr-2" />
						{time}
					</div>
					<div className="flex items-center text-gray-400">
						<MapPinIcon className="w-4 h-4 mr-2" />
						{venue}
					</div>
				</div>
				<div className="mt-4 space-y-2">
					<Badge
						variant="secondary"
						className="bg-white/10 text-white text-xs w-full justify-center"
					>
						{category}
					</Badge>
					<Button
						variant="outline"
						size="sm"
						className="w-full border-white/20 hover:bg-white/10"
						onClick={() => handleOnClick(id)}
					>
						<Ticket className="w-4 h-4 mr-2" />
						Book Now
					</Button>
				</div>
			</div>
		</div>
	)
}

export default function EventLandingPage() {
	const { data: ticketsData } = useGetTicketsQuery()

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
						{ticketsData &&
							ticketsData.map((event) => (
								<EventTicketCard
									key={event.id}
									title={event.title}
									id={event.id}
								/>
							))}
					</div>
				</section>
			</main>
		</div>
	)
}
