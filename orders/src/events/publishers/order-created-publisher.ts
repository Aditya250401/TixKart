import { Publisher, OrderCreatedEvent, Subjects } from '@aditya250401/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
