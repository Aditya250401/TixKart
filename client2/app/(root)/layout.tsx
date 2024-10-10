import Navbar from '@/components/bars/Navbar'

function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className="relative flex min-h-screen flex-col">
			<Navbar />
			<div className="flex-1">{children}</div>
		</div>
	)
}

export default RootLayout
