

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<div className="md:hidden"></div>
			<div className="hidden space-y-6 p-10 pb-16 md:block">
				<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
					<aside className="-mx-4 lg:w-1/5">

					</aside>
					<div className="flex-1">{children}</div>
				</div>
			</div>
		</>
	)
}
