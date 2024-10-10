'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, UserIcon, PencilIcon, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
	{ name: 'Home', icon: HomeIcon, path: '/' },
	{ name: 'Profile', icon: UserIcon, path: '/profile' },
	{ name: 'create', icon: PencilIcon, path: '/tickets/create' },
	{ name: 'cart', icon: ShoppingCart, path: '/cart' },
]

export default function Navbar() {
	const pathname = usePathname()

	return (
		<nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
			<div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
				<Link href="/" className="flex items-center space-x-2">
					<span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-white">
						Cosmix
					</span>
				</Link>
				<div className="flex items-center space-x-1">
					{navItems.map((item) => {
						const isActive = pathname === item.path
						return (
							<Button
								key={item.name}
								variant={isActive ? 'secondary' : 'ghost'}
								size="icon"
								className={`relative ${
									isActive
										? 'text-primary bg-[#9e9c9c]'
										: 'text-muted-foreground hover:text-foreground'
								}`}
								asChild
							>
								<Link href={item.path}>
									<item.icon className="h-5 w-5" />
									<span className="sr-only">{item.name}</span>
									{isActive && (
										<span className="absolute -bottom-1 left-1/2 h-1 w-1 rounded-full bg-primary" />
									)}
								</Link>
							</Button>
						)
					})}
				</div>
			</div>
		</nav>
	)
}
