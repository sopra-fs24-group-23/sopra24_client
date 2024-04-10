import React, { useRef } from "react";
import { Client } from "@stomp/stompjs";
import { getWebSocketDomain } from "../../helpers/getDomain.js";
import { isProduction } from "../../helpers/isProduction.js";
import StompSubscriptionRequest from "../../interfaces/StompSubscriptionRequest";
import WebSocketContext from "../../contexts/WebSocketContext";
import PropTypes from "prop-types";

const WebSocketProvider = ({ children }) => {
  const stompClient = useRef(null);
  const subscriptionRequests = useRef(new Map());

  /** Connect function, returns promise that is only resolved after successful connection,
   * otherwise rejected. Does nothing if the client is already initialized and connected**/
  const connect = ( sessionId ) => {
    return new Promise((resolve, reject) => {
      console.log("RECEIVED ID: " + sessionId)
      if (!stompClient.current) {
        // client setup
        stompClient.current = new Client({
          brokerURL: `${getWebSocketDomain()}`, // might need to change to "/ws" here
          heartbeatIncoming: 10000,
          heartbeatOutgoing: 10000,
          reconnectDelay: 5000,
          debug: isProduction() ? undefined : (str) => console.log(str),
          beforeConnect: isProduction() ? undefined : () => console.log("Connecting websocket."),
          onStompError: (frame) => {
            `Encountered a StompError: ${frame}`;
          },
          onWebSocketError: () => {
            "Encountered a WebSocketError."
          }
        });
        // on connection: (re-)subscribe all subscriptions and resolve promise
        stompClient.current.onConnect = () => {
          subscriptionRequests.current.forEach((request) => {
            request.subscription = stompClient.current.subscribe(request.destination, request.callback);
          });
          resolve();
        };
      } else if (stompClient.current && !stompClient.current.active) {
        stompClient.current.activate();
      }
    });
  };

  const disconnect = () => {
    stompClient.current.deactivate();
  };

  /** method to send a body to an app-destination in the BE
   * NOTICE: this method DOES NOT CALL JSON.stringify() on the body -> do it in client code!**/
  function send(destination: string, body: any) {
    if (stompClient.current && stompClient.current.active) {
      stompClient.current.publish({
        destination: destination,
        body: body,
      });
    }
  }

  /** Method to subscribe to a topic/queue destination in the BE
   * NOTICE: method is called subscribeClient to avoid confusion
   * Only one subscription per destination is allowed**/
  function subscribeClient(pDestination: string, pCallback: Function) {
    // if websocket is connected
    if(stompClient.current && stompClient.current.active) {
      const subscriptionReference = stompClient.current.subscribe(pDestination, pCallback)
      const subscriptionRequest = {
        destination: pDestination,
        callback: pCallback,
        subscription: subscriptionReference
      }
      subscriptionRequests.current.set(pDestination, subscriptionRequest)
    }
    else if (!isProduction()) {
      alert("You tried adding a subscription to an empty or inactive STOMP-Client");
      console.log("You tried adding a subscription to an empty or inactive STOMP-Client.");
    }
    // error message in dev-environment
  }

  function unsubscribeClient(name: string) {
    if (stompClient.current && stompClient.current.active) {
      // retrieve request from requestList
      const request = subscriptionRequests.current.get(name);
      // unsubscribe
      request.subscription.unsubscribe();
      // delete from  requestList
      subscriptionRequests.current.delete(name);
    }
  }

  return (
    <WebSocketContext.Provider value={{ connect, disconnect, send, subscribeClient, unsubscribeClient }}>
      {children}
    </WebSocketContext.Provider>
  );
};

WebSocketProvider.propTypes = {
  children: PropTypes.node,
};

export default WebSocketProvider;