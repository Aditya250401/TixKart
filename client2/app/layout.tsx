import type { Metadata } from 'next'

import './globals.css'
import { ThemeProvider } from './themeProvider'
import { Providers } from './StoreProvider'
import { Toaster } from '@/components/ui/toaster'
import { Manrope as FontSans } from 'next/font/google'

import { cn } from '@/lib/utils'

const fontSans = FontSans({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
	variable: '--font-sans',
})

export const metadata: Metadata = {
	title: 'Cosmix',
	description: 'Ticket Booking App',
}

function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<ThemeProvider
				attribute="class"
				defaultTheme="dark"
				enableSystem
				disableTransitionOnChange
			>
				<Providers>
					<body
						className={cn(
							'min-h-screen bg-dark-300 font-sans antialiased',
							fontSans.variable
						)}
					>
						{children}
						<Toaster />
					</body>
				</Providers>
			</ThemeProvider>
		</html>
	)
}

export default RootLayout
