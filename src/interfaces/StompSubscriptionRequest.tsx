import { StompSubscription } from "@stomp/stompjs";

export default interface StompSubscriptionRequest {
  destination: string,
  sessionId: string,
  callback: Function
  subscription?: StompSubscription
}