'use client'
import { useEffect } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { UserValidation } from '@/lib/models/user'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { redirect } from 'next/navigation'

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

import { useAddUserMutation } from '@/lib/redux/store'

import { setCredentials } from '@/lib/redux/appSlice'
import { useDispatch } from 'react-redux'

const SignUpForm = () => {
	const dispatch = useDispatch()
	const { toast } = useToast()

	const [addUser, results] = useAddUserMutation()

	const form = useForm<z.infer<typeof UserValidation>>({
		resolver: zodResolver(UserValidation),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const onSubmit = (values: z.infer<typeof UserValidation>) => {
		addUser(values).unwrap()
	}
	useEffect(() => {
		if (results.isSuccess) {
			toast({
				title: 'signup successful',
				description: `welcome ${results.data.email}`,
			})
			dispatch(setCredentials({ user: results.data }))
			redirect('/')
		}

		if (results.isError) {
			toast({
				title: 'signup failed',
				description: `${results.error.data.message}`,
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
						name="email"
						render={({ field }) => (
							<FormItem className="flex w-full flex-col gap-3">
								<FormLabel className="text-base-semibold text-light-2">
									Email
								</FormLabel>
								<FormControl>
									<Input
										type="email"
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
						name="password"
						render={({ field }) => (
							<FormItem className="flex w-full flex-col gap-3">
								<FormLabel className="text-base-semibold text-light-2">
									Password
								</FormLabel>
								<FormControl>
									<Input
										type="password"
										className="account-form_input no-focus text-white"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="shad-primary-btn w-full">
						Sign-up
					</Button>
				</form>
			</Form>
			<p className="px-8 text-center text-sm text-muted-foreground mt-10">
				already signed-up?{' '}
				<Link
					href="/auth/signin"
					className="underline underline-offset-4 hover:text-primary text-blue-500"
				>
					Sign-In
				</Link>
			</p>
		</>
	)
}

export default SignUpForm
