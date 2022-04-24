import React, { useCallback } from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"
import { Routes, Route, useParams } from "react-router-dom"

const TeacherOrStudent = () => {
    const { sendMessage, lastMessage, readyState } = useWebSocket(
        "ws://" +
            window.location.host +
            "/ws/chat/" +
            "roomName" +
            "/" +
            "carson" +
            "/" +
            "teacher" +
            "/"
    )

    let { room, name, id } = useParams()

    const handleClickSendMessage = useCallback(
        () => sendMessage('{"message": "world"}'),
        []
    )

    const connectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    }[readyState]

    return (
        <div>
            <span>The WebSocket is currently {connectionStatus}</span>
        </div>
    )
}

export default TeacherOrStudent
