import {
	Subjects,
	Publisher,
	ExpirationCompleteEvent,
} from '@aditya250401/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}
