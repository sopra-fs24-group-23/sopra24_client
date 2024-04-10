import { StompSubscription } from "@stomp/stompjs";

export default interface StompSubscriptionRequest {
  destination: string,
  callback: Function
  subscription?: StompSubscription
}