import React, { useRef } from "react";
import { Client } from "@stomp/stompjs";
import { getWebSocketDomain } from "../../helpers/getDomain.js";
import { isProduction } from "../../helpers/isProduction.js";
import StompSubscriptionRequest from "../../interfaces/StompSubscriptionRequest";
import WebSocketContext from "../../contexts/WebSocketContext";
import PropTypes from "prop-types";

const WebSocketProvider = ({ children }) => {
  const stompClient = useRef(null);
  const sessionId = useRef("");
  const subscriptionRequests = useRef(new Map());

  /** Connect function, returns promise that is only resolved after successful connection,
   * otherwise rejected. Does nothing if the client is already initialized and connected **/
  const connect = ( lobbyId: string ): Promise<void> => {
    return new Promise((resolve, reject) => {
      sessionId.current = lobbyId;
      // if client not initialized or inactive; create new one
      if (!stompClient.current || !stompClient.current.active) {
        console.log("Connect called, sessionId: " + sessionId.current)
        // client setup
        stompClient.current = new Client({
          brokerURL: `${getWebSocketDomain()}`,
          heartbeatIncoming: 10000,
          heartbeatOutgoing: 10000,
          reconnectDelay: 5000,
          debug: isProduction() ? () => {} : (str) => console.log(str),
          beforeConnect: isProduction() ? () => {} : () => console.log("Connecting websocket..."),
          onStompError: (frame) => {
            `Encountered a StompError: ${frame}`;
            alert("Sorry! We've encountered a Stomp-Error, redirecting to homepage.")
          },
          onWebSocketError: (frame) => {
            "Encountered a WebSocketError."
            alert("Sorry! We've encountered a Websocket-Error, redirecting to homepage.")
          }
        })
        stompClient.current.onConnect = () => {
          subscriptionRequests.current.forEach((request) => {
            if (sessionId.current === request.sessionId) {
              request.subscription = stompClient.current.subscribe(request.destination, request.callback)
            }
            else {
              console.log("Discarding subscription: " + request.destination)
              subscriptionRequests.current.delete(request.destination)
            }
          })
          resolve()
        }
      }
      // finally, activate the connection
      stompClient.current.activate()
    });
  };

  const disconnect = () => {
    // might need to do more here: delete subscription requests?
    stompClient.current.deactivate();
  };

  /** method to send a body to an app-destination in the BE
   * NOTICE: this method DOES NOT CALL JSON.stringify() on the body -> do it in client code!**/
  function send(destination: string, body: any) {
    if (stompClient.current && stompClient.current.active) {
      console.log("Sending message to", destination, "with body:", body);
      stompClient.current.publish({
        destination: destination,
        body: body,
      });
    } else {
      console.error("Attempted to send a message without an active STOMP connection.");
    }
  }

  /** Method to subscribe to a topic/queue destination in the BE
   * NOTICE: method is called subscribeClient to avoid confusion
   * Only one subscription per destination is allowed**/
  function subscribeClient(pDestination: string, pCallback: Function) {
    // if websocket is connected
    if(stompClient.current && stompClient.current.active) {
      const subscriptionReference = stompClient.current.subscribe(pDestination, pCallback)
      const subscriptionRequest: StompSubscriptionRequest = {
        destination: pDestination,
        callback: pCallback,
        sessionId: sessionId.current,
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

  function unsubscribeClient(destination: string) {
    if (stompClient.current && stompClient.current.active) {
      // retrieve request from requestList
      const request = subscriptionRequests.current.get(destination);
      if (request.subscription) {
        // unsubscribe
        request.subscription.unsubscribe();
      }
      // delete from  requestList
      subscriptionRequests.current.delete(destination);
    }
  }

  function unsubscribeAll() {
    if (stompClient.current && stompClient.current.active) {
      subscriptionRequests.current.forEach((destination, request) => {
        if (request.subscription) {
          request.subscription.unsubscribe();
        }
      })
    }
  }

  return (
    <WebSocketContext.Provider value={{ connect, disconnect, send, subscribeClient, unsubscribeClient, unsubscribeAll }}>
      {children}
    </WebSocketContext.Provider>
  );
};

WebSocketProvider.propTypes = {
  children: PropTypes.node,
};

export default WebSocketProvider;