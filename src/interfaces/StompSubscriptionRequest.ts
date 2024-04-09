import { StompSubscription } from "@stomp/stompjs";

export default interface StompSubscriptionRequest {
  name: string,
  destination: string,
  callback: Function
  subscription?: StompSubscription
}