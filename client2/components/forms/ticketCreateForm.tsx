'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { TicketCreate } from '@/lib/models/user'

import { redirect } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { useCreateTicketMutation } from '@/lib/redux/store'

export default function TicketCreateForm() {
	const { toast } = useToast()

	const form = useForm<z.infer<typeof TicketCreate>>({
		resolver: zodResolver(TicketCreate),
		defaultValues: {
			title: '',
			price: 0o0,
		},
	})

	const [createTicket, results] = useCreateTicketMutation()

	const onSubmit = async (values: z.infer<typeof TicketCreate>) => {
		await createTicket(values).unwrap()
	}

	useEffect(() => {
		if (results.isSuccess) {
			toast({
				title: 'ticket created succesfully successful',
				description: ` ticket ${results.data.title} created`,
			})
			redirect('/')
		}

		if (results.isError) {
			toast({
				title: 'ticket creation failed',
				description: `${
					results.error?.data?.errors?.[0]?.message || 'Unknown error'
				}`,
			})
		}
	}, [results])

	return (
		<>
			<Form {...form}>
				<form
					className="flex flex-col justify-start gap-10 text-white text-2xl"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					{/* Add fields for other keys in the UserValidation schema */}
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem className="flex w-full flex-col gap-3">
								<FormLabel className="text-base-semibold text-light-2">
									Title
								</FormLabel>
								<FormControl>
									<Input
										type="string"
										className="account-form_input no-focus text-white"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="price"
						render={({ field: { value, onChange }, fieldState: { error } }) => (
							<FormItem className="flex w-full flex-col gap-3">
								<FormLabel className="text-base-semibold text-light-2">
									price
								</FormLabel>
								<FormControl>
									<Input
										type="number"
										className="account-form_input no-focus text-white"
										value={value}
										onChange={(e) => onChange(Number(e.target.value))}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button disabled={results.isLoading} className="bg-white text-black">
						Create Ticket
					</Button>
				</form>
			</Form>
		</>
	)
}
