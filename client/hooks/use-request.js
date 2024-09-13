import axios from 'axios'
import { useState } from 'react'

export default ({ url, method, body, onSuccess }) => {
	const [errors, setErrors] = useState(null)

	const doRequest = async (props = {}) => {
		try {
			setErrors(null) // Reset errors before making the request

			// Make the API call with axios
			const response = await axios[method](url, { ...body, ...props })
			console.log(response, 'response from', url) // Log the response for debugging

			// Call the onSuccess callback if it exists
			if (onSuccess) {
				onSuccess(response.data)
			}

			return response.data // Return the data
		} catch (err) {
			console.error('Error in doRequest:', err) // Log the error for debugging

			// Check for an array of errors or fallback to general error display
			const errorContent = err.response?.data?.errors
			if (errorContent && Array.isArray(errorContent)) {
				setErrors(
					<div className="alert alert-danger">
						<h4>Oops....</h4>
						<ul className="my-0">
							{errorContent.map((error, index) => (
								<li key={index}>{error.message}</li>
							))}
						</ul>
					</div>
				)
			} else {
				setErrors(
					<div className="alert alert-danger">
						<h4>Oops....</h4>
						<p>{err.message || 'An unknown error occurred'}</p>
					</div>
				)
			}
		}
	}

	return { doRequest, errors }
}
