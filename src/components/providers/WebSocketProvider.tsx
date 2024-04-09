import React, { ReactNode, useRef } from "react";
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

    const connect = ({ sessionId }) => {
        // if there is no active client yet
        if(!stompClient.current) {
            aSessionId.current = sessionId;
            // client setup
            stompClient.current = new Client({
                brokerURL: `${getDomain()}ws`, // might need to change to "/ws" here
                heartbeatIncoming: 10000,
                heartbeatOutgoing: 10000,
                reconnectDelay: 5000,
                debug: isProduction() ? undefined : (str) => console.log(str)
            })
            // enable debug logging  in dev environment
            if(!isProduction()) {
                stompClient.current.debug = (str) => { console.log(str); }
            }
            // (re-)subscribe all subscriptions on connection
            stompClient.current.onConnect = () => {
                subscriptionRequests.current.forEach((request) => {
                    stompClient.current.subscribe(request.destination, request.callback)
                })
            }
        }
        // finally, activate the client
        stompClient.current.activate()
    }

    const disconnect = () => {
        stompClient.current.deactivate();
    }

    /** method to send a body to an app-destination in the BE
     * NOTICE: this method calls JSON.stringify() on the body **/
    function send ({ destination, body }) {
        if(stompClient.current && stompClient.current.active()) {
            stompClient.current.publish({
                destination: `${destination}`,
                body: `${JSON.stringify(body)}`} // here :)
            )
        }
    }

    /** Method to subscribe to a topic/queue destination in the BE
     * NOTICE: method is called subscribeClient to avoid confusion
     * with stompClient.subscribe **/
    function subscribeClient ( subscriptionRequest : StompSubscriptionRequest) {
        if(stompClient.current && stompClient.current.active()) {
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
        if(stompClient.current && stompClient.current.active()) {
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