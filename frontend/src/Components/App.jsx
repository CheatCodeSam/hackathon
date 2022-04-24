import React from "react"
import { Routes, Route } from "react-router-dom"
import Game from "./Game"

const App = () => {
    return (
        <Routes>
            <Route path="/room/:room/name/:name/id/:id" element={<Game />} />
        </Routes>
    )
}

export default App
