import { Publisher, Subjects, TicketCreatedEvent } from '@aditya250401/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated
}
