import type { Metadata } from 'next'

import './globals.css'
import { ThemeProvider } from './themeProvider'
import { Providers } from './StoreProvider'
import { Toaster } from '@/components/ui/toaster'

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
					<body className={`antialiased`}>
						{children}
						<Toaster />
					</body>
				</Providers>
			</ThemeProvider>
		</html>
	)
}

export default RootLayout
