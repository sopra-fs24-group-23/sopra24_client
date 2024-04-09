import React, { useRef } from "react";
import { Client } from "@stomp/stompjs";
import { getDomain } from "../../helpers/getDomain.js";
import { isProduction } from "../../helpers/isProduction.js"
import StompSubscriptionRequest from "../../interfaces/StompSubscriptionRequest";
import WebSocketContext from "../../contexts/WebSocketContext"
import PropTypes from "prop-types";

const WebSocketProvider = ({ children }) => {

    const aSessionId = useRef(null);
    const stompClient = useRef(null);
    const subscriptionRequests = useRef(new Map())

    /** Connect function, returns promise that is only resolved after successful connection,
     * otherwise rejected. Does nothing if the client is already initialized and connected**/
    const connect = ({ sessionId }) => {
        return new Promise((resolve, reject) => {
            if (!stompClient.current) {
                aSessionId.current = sessionId;
                // client setup
                stompClient.current = new Client({
                    brokerURL: `${getDomain()}ws`, // might need to change to "/ws" here
                    heartbeatIncoming: 10000,
                    heartbeatOutgoing: 10000,
                    reconnectDelay: 5000,
                    debug: isProduction() ? undefined : (str) => console.log(str),
                    beforeConnect: isProduction() ? undefined : () => console.log("Connecting websocket."),
                    onStompError: (frame) => {
                        `Encountered a StompError: ${frame}`
                    }
                })
                // on connection: (re-)subscribe all subscriptions and resolve promise
                stompClient.current.onConnect = () => {
                    subscriptionRequests.current.forEach((request) => {
                        stompClient.current.subscribe(request.destination, request.callback)
                    })
                    resolve()
                }
            }
            else if(stompClient.current && !stompClient.current.active){
                stompClient.current.activate()
            }
        })
    }

    const disconnect = () => {
        stompClient.current.deactivate();
    }

    /** method to send a body to an app-destination in the BE
     * NOTICE: this method calls JSON.stringify() on the body **/
    function send ( destination: string, body: any ) {
        if(stompClient.current && stompClient.current.active) {
            stompClient.current.publish({
                destination: destination,
                body: `${JSON.stringify(body)}`} // here :)
            )
        }
    }

    /** Method to subscribe to a topic/queue destination in the BE
     * NOTICE: method is called subscribeClient to avoid confusion
     * with stompClient.subscribe
     * subscriptionRequest names must be unique**/
    function subscribeClient ( subscriptionRequest : StompSubscriptionRequest) {
        if(subscriptionRequests.current.has(subscriptionRequest.name)) {
            console.log("You tried to add a subscriptionRequest with a duplicate name, the names must be unique")
            alert("Cannot create two subscriptionRequests with the same name.")
        }
        else if(stompClient.current && stompClient.current.active) {
            // subscribe client, store subscription to request object for unsubscribing
            subscriptionRequest.subscription =
                stompClient.current.subscribe(
                    `${subscriptionRequest.destination}`,
                    subscriptionRequest.callback
                );
            // add subscription request to list to allow re-subscription
            subscriptionRequests.current.set(subscriptionRequest.name, subscriptionRequest)
        }
        // error message in dev-environment
        else if (!isProduction()) {
            alert("You tried adding a subscription to an empty or inactive STOMP-Client")
            console.log("You tried adding a subscription to an empty or inactive STOMP-Client.")
        }
    }

    function unsubscribeClient ( name : string ) {
        if(stompClient.current && stompClient.current.active) {
            // retrieve request from requestList
            const request = subscriptionRequests.current.get(name)
            // unsubscribe
            request.subscription.unsubscribe()
            // delete from  requestList
            subscriptionRequests.current.delete(name)
        }
    }

    return (
        <WebSocketContext.Provider value={{ connect, disconnect, send, subscribeClient, unsubscribeClient}}>
            {children}
        </WebSocketContext.Provider>
    )
}

WebSocketProvider.propTypes = {
    children: PropTypes.node
}

export default WebSocketProvider;