'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface CartItem {
	id: number
	name: string
	price: number
	quantity: number
}

export default function Component() {
	const [cartItems, setCartItems] = useState<CartItem[]>([
		{ id: 1, name: 'Cosmic Harmony Ticket - VIP', price: 129.99, quantity: 2 },
		{ id: 2, name: 'Event T-Shirt', price: 24.99, quantity: 1 },
	])

	const updateQuantity = (id: number, newQuantity: number) => {
		setCartItems(
			cartItems
				.map((item) =>
					item.id === id
						? { ...item, quantity: Math.max(0, newQuantity) }
						: item
				)
				.filter((item) => item.quantity > 0)
		)
	}

	const subtotal = cartItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	)
	const serviceFee = 20.0
	const tax = subtotal * 0.1 // Assuming 10% tax
	const total = subtotal + serviceFee + tax

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
					Your Cosmic Cart
				</h1>
				<p className="text-xl md:text-2xl font-medium text-teal-300">
					Review and confirm your stellar selections
				</p>
			</div>
			<Card className="w-full max-w-4xl bg-gray-800/50 backdrop-blur-md border-gray-700 text-gray-100 shadow-2xl relative z-10">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-teal-300 flex items-center">
						<ShoppingCart className="mr-2" />
						Shopping Cart
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						{cartItems.map((item) => (
							<div key={item.id} className="flex items-center justify-between">
								<div className="flex-1">
									<h3 className="text-lg font-semibold text-gray-200">
										{item.name}
									</h3>
									<p className="text-sm text-gray-400">
										${item.price.toFixed(2)} each
									</p>
								</div>
								<div className="flex items-center space-x-2">
									<Button
										variant="outline"
										size="icon"
										onClick={() => updateQuantity(item.id, item.quantity - 1)}
										className="h-8 w-8 rounded-full bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
									>
										<Minus className="h-4 w-4" />
									</Button>
									<span className="w-8 text-center">{item.quantity}</span>
									<Button
										variant="outline"
										size="icon"
										onClick={() => updateQuantity(item.id, item.quantity + 1)}
										className="h-8 w-8 rounded-full bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
									>
										<Plus className="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => updateQuantity(item.id, 0)}
										className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-transparent"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
						))}
					</div>
					<Separator className="my-6 bg-gray-700" />
					<div className="space-y-4">
						<div className="flex justify-between text-gray-300">
							<span>Subtotal</span>
							<span>${subtotal.toFixed(2)}</span>
						</div>
						<div className="flex justify-between text-gray-300">
							<span>Service Fee</span>
							<span>${serviceFee.toFixed(2)}</span>
						</div>
						<div className="flex justify-between text-gray-300">
							<span>Estimated Tax</span>
							<span>${tax.toFixed(2)}</span>
						</div>
						<Separator className="my-2 bg-gray-700" />
						<div className="flex justify-between text-lg font-semibold">
							<span className="text-gray-100">Total</span>
							<span className="text-teal-300">${total.toFixed(2)}</span>
						</div>
					</div>
					<div className="mt-8">
						<Button
							className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white text-lg py-6 rounded-full transition-all duration-300 transform hover:scale-105"
							size="lg"
						>
							Proceed to Checkout
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
