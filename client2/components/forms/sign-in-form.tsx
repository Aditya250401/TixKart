'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { UserLoginValidation } from '@/lib/models/user'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
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

import { useLoginUserMutation } from '@/lib/redux/store'

import { setCredentials } from '@/lib/redux/appSlice'
import { useDispatch } from 'react-redux'


export default function SignInForm() {
	const router = useRouter()
	const dispatch = useDispatch()
	const { toast } = useToast()

	const form = useForm<z.infer<typeof UserLoginValidation>>({
		resolver: zodResolver(UserLoginValidation),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const [loginUser, results] = useLoginUserMutation()

	const onSubmit = async (values: z.infer<typeof UserLoginValidation>) => {
		try {
			await loginUser(values).unwrap()
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		if (results.isSuccess) {
			toast({
				title: 'login successful',
				description: `welcome ${results.data.email}`,
				variant: 'success',
			})
			dispatch(setCredentials({ user: results.data }))
			router.replace('/') // Redirect to the sign-in page
		}

		if (results.isError) {
			toast({
				title: 'login failed',
				description: `${results.error.data.message}`,
				variant: 'destructive',
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

					<Button
						disabled={results.isLoading}
						type="submit"
						className="bg-white text-black"
					>
						Sign-In
					</Button>
				</form>
			</Form>
			<p className="px-8 text-center text-sm text-muted-foreground mt-10">
				Not registered?{' '}
				<Link
					href="/auth/signup"
					className="underline underline-offset-4 hover:text-primary text-blue-500"
				>
					Register Now
				</Link>
			</p>
		</>
	)
}
