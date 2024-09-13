import { Publisher, Subjects, TicketUpdatedEvent } from '@aditya250401/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated
}
