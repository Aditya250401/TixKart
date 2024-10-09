'use client'

function Home({ tickets }) {
	console.log('these are tickets', tickets)
	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			xcvdfbbf
		</div>
	)
}

Home.getInitialProps = async (context, client, currentUser) => {
	const { data } = await client.get('/api/tickets')
	return { tickets: data }
}

export default Home
