import TicketCreateForm from '@/components/forms/ticketCreateForm'
import Image from 'next/image'

const Register = async () => {
	return (
		<div className="flex h-screen max-h-screen">
			<section className="remove-scrollbar container my-auto">
				<div className="sub-container max-w-[496px]">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="text-3xl font-semibold text-white tracking-tight">
							Create a Ticket
						</h1>
					</div>

					<TicketCreateForm />

					<div className="text-14-regular mt-20 flex justify-between">
						<p className="justify-items-end text-dark-600 xl:text-left">
							© 2024 Cosmix
						</p>
					</div>
				</div>
			</section>

			<Image
				src="/assets/images/register-img.png"
				height={1000}
				width={1000}
				alt="patient"
				className="side-img max-w-[390px]"
			/>
		</div>
	)
}

export default Register
