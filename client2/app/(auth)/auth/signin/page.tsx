'use client'
import SignInForm from '@/components/forms/sign-in-form'
import Image from 'next/image'
import Link from 'next/link'

const Page = () => {
	return (
		<div className="flex h-screen max-h-screen">
			<section className="remove-scrollbar container my-auto">
				<div className="sub-container max-w-[496px]">
					
					<div className="flex flex-col space-y-2 text-center">
					<h1 className="text-3xl font-semibold text-white tracking-tight">
						Sign-In to Cosmix
					</h1>
					<p className="text-xl text-muted-foreground">Enter your details</p>
				</div>

					<SignInForm />

					<div className="text-14-regular mt-20 flex justify-between">
						<p className="justify-items-end text-dark-600 xl:text-left">
							© 2024 Cosmix
						</p>
						<Link href="/?admin=true" className="text-green-500">
							Admin
						</Link>
					</div>
				</div>
			</section>

			<Image
				src="/assets/images/onboarding-img.png"
				height={1000}
				width={1000}
				alt="patient"
				className="side-img max-w-[50%]"
			/>
		</div>
	)
}

export default Page
