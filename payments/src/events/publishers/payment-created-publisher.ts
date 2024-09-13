

import { Subjects, Publisher, PaymentCreatedEvent } from '@aditya250401/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}
