import { createContext } from "react";

/** creating context outside of provider component, to avoid
 * recreating the context whenever the component (re-)mounts **/

const WebSocketContext = createContext(null)

export default WebSocketContext;