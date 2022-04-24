import { useParams } from "react-router-dom"
import SocketHandler from "./SocketHandler"

const Game = () => {
    const { room, name, id } = useParams()

    return (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
            <SocketHandler room={room} name={name} id={id} />
        </div>
    )
}

export default Game
