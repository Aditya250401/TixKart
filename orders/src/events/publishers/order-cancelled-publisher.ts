import { Subjects, Publisher, OrderCancelledEvent } from '@aditya250401/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
