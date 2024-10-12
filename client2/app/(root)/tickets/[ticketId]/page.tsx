'use client'

// import { useState } from 'react'
import { useEffect } from 'react'
import { redirect } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'
import { Calendar, Clock, MapPin, Info, Ticket } from 'lucide-react'
// import { plus , Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import {
	useGetTicketByIdQuery,
	useCreateOrderMutation,
} from '@/lib/redux/store'

interface PostShowPageProps {
	params: {
		ticketId: string
	}
}

export default function Component({ params }: PostShowPageProps) {
	const { ticketId } = params

	const { data } = useGetTicketByIdQuery(ticketId as string)

	const [createOrder, results] = useCreateOrderMutation()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		await createOrder({ ticketId }).unwrap() // Unwrap to handle errors
	}

	useEffect(() => {
		if (results.isSuccess) {
			const time = new Date(results.data.expiresAt).toLocaleTimeString()
			toast({
				title: 'order created succesfull',
				description: `the order will expire at ${time}`,
				variant: 'success',
			})

			redirect('/cart')
		}

		if (results.isError) {
			toast({
				title: 'order creation failed',
				description: `${results.error.data.message}`,
				variant: 'destructive',
			})
		}
	}, [results])

	// const [quantity, setQuantity] = useState(1)

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-100 flex flex-col items-center justify-start p-4 relative overflow-hidden">
			<div className="absolute inset-0 z-0">
				<Image
					src="/placeholder.svg"
					alt="Blurred background"
					layout="fill"
					objectFit="cover"
					className="opacity-10 blur-sm"
				/>
			</div>
			<div className="w-full max-w-6xl text-center mb-8 relative z-10">
				<h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
					{data?.title}
				</h1>
				<p className="text-xl md:text-2xl font-medium text-teal-300">
					Featuring: Stellar Sounds & The Nebula Orchestra
				</p>
			</div>
			<Card className="w-full max-w-5xl bg-gray-800/50 backdrop-blur-md border-gray-700 text-gray-100 shadow-2xl relative z-10">
				<div className="grid lg:grid-cols-2 gap-8 p-8">
					<div className="space-y-8">
						<div className="relative aspect-[16/9] rounded-lg overflow-hidden shadow-lg">
							<Image
								src="/assets/images/poster.png"
								alt="Event poster"
								layout="fill"
								objectFit="cover"
								className="transition-transform duration-300 hover:scale-105"
							/>
						</div>
						<div className="space-y-4">
							<h2 className="text-3xl font-bold text-teal-300">
								Event Description
							</h2>
							<p className="text-lg text-gray-300 leading-relaxed">
								Immerse yourself in a celestial symphony of sound and light.
								Cosmic Harmony brings together the ethereal melodies of Stellar
								Sounds and the grand orchestrations of The Nebula Orchestra for
								an unforgettable night of cosmic musical exploration.
							</p>
						</div>
					</div>
					<div className="flex flex-col space-y-8">
						<div className="bg-gray-700/50 rounded-lg p-6 space-y-6">
							<h3 className="text-2xl font-semibold mb-4 text-teal-300">
								Event Details
							</h3>
							<div className="space-y-4 text-lg">
								<div className="flex items-center">
									<Calendar className="mr-4 h-6 w-6 text-teal-400 flex-shrink-0" />
									<div>
										<p className="font-medium text-gray-200">Date</p>
										<p className="text-gray-400">September 15, 2024</p>
									</div>
								</div>
								<div className="flex items-center">
									<Clock className="mr-4 h-6 w-6 text-teal-400 flex-shrink-0" />
									<div>
										<p className="font-medium text-gray-200">Time</p>
										<p className="text-gray-400">
											Doors: 7:00 PM | Show: 8:00 PM
										</p>
									</div>
								</div>
								<div className="flex items-center">
									<MapPin className="mr-4 h-6 w-6 text-teal-400 flex-shrink-0" />
									<div>
										<p className="font-medium text-gray-200">Venue</p>
										<p className="text-gray-400">
											Starlight Arena, Universe City
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className="bg-gray-700/50 rounded-lg p-6">
							<h3 className="text-2xl font-semibold mb-4 text-teal-300">
								Ticket Details
							</h3>
							<div className="grid grid-cols-3 gap-4 text-center">
								<div className="bg-gray-600/50 p-3 rounded-lg">
									<p className="text-sm text-gray-400">Section</p>
									<p className="text-lg font-semibold text-gray-200">VIP A</p>
								</div>
								<div className="bg-gray-600/50 p-3 rounded-lg">
									<p className="text-sm text-gray-400">Row</p>
									<p className="text-lg font-semibold text-gray-200">3</p>
								</div>
								<div className="bg-gray-600/50 p-3 rounded-lg">
									<p className="text-sm text-gray-400">Seat</p>
									<p className="text-lg font-semibold text-gray-200">15-16</p>
								</div>
							</div>
						</div>
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<span className="text-xl text-gray-300">Price per ticket</span>
								<span className="text-2xl font-bold text-teal-300">
									{data?.price}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-xl text-gray-300">Quantity</span>
								{/* <div className="flex items-center bg-gray-700/50 rounded-full">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => setQuantity(Math.max(1, quantity - 1))}
										className="h-10 w-10 rounded-full text-gray-300 hover:text-white hover:bg-gray-600/50"
									>
										<Minus className="h-4 w-4" />
									</Button>
									<span className="mx-4 text-xl font-semibold text-gray-200">
										{quantity}
									</span>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => setQuantity(quantity + 1)}
										className="h-10 w-10 rounded-full text-gray-300 hover:text-white hover:bg-gray-600/50"
									>
										<Plus className="h-4 w-4" />
									</Button>
								</div> */}
							</div>
							<Separator className="my-4 bg-gray-600" />
							<div className="flex justify-between items-center">
								<span className="text-2xl font-semibold text-gray-300">
									Total
								</span>
								<span className="text-3xl font-bold text-teal-300">
									{data?.price}
								</span>
							</div>
							<Button
								className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white text-lg py-6 rounded-full transition-all duration-300 transform hover:scale-105"
								size="lg"
								onClick={handleSubmit}
							>
								<Ticket className="mr-2 h-5 w-5" />
								Add to Cart
							</Button>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<p className="text-center text-sm text-gray-400 mt-2 cursor-help">
											Additional fees may apply{' '}
											<Info className="inline h-4 w-4" />
										</p>
									</TooltipTrigger>
									<TooltipContent>
										<p className="bg-gray-800 text-gray-200 p-2 rounded-md">
											Service fees and taxes will be calculated at checkout
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>
				</div>
			</Card>
		</div>
	)
}
