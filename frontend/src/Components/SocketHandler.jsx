import { useState, useCallback, useEffect, useRef } from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"
import Question from "./Question"

const SocketHandler = (props) => {
    const [gameStarted, setGameStarted] = useState(false)
    const [gameFinished, setGameFinished] = useState(false)
    const [questions, setQuestions] = useState({})
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [numOfAnswers, setNumOfAnswers] = useState(0)
    const [showAnswer, setShowAnswer] = useState(false)
    const [gotItRight, setGotItRight] = useState([])

    const [finalRanking, setFinalRanking] = useState([0])

    const [isDisabled, setIsDisabled] = useState(false)

    const webSocket = useRef(null)

    const wsURL =
        "ws://" +
        window.location.host +
        "/ws/chat/" +
        props.room +
        "/" +
        props.name +
        "/" +
        props.id +
        "/"

    useEffect(() => {
        const ws = new WebSocket(wsURL)
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            if (data.func === "startgame") {
                setGameStarted(true)
                setQuestions(data.startgame.questions)
            }
            if (data.func === "progress") {
                setCurrentQuestion(data.progress)
                setNumOfAnswers(0)
                setShowAnswer(false)
                setIsDisabled(false)
            }
            if (data.func === "answer") {
                setNumOfAnswers(data.number_of_answers)
            }
            if (data.func === "showanswer") {
                setShowAnswer(true)
                setGotItRight(data.got_it_right)
            }
            if (data.func === "endgame") {
                setFinalRanking(data.endgame)
                setGameFinished(true)
                console.log(data.endgame)
            }

            console.log(event.data)
        }
        webSocket.current = ws
    }, [])

    const isTeacher = props.id === "teacher"

    const StartGame = useCallback(
        () => webSocket.current.send(JSON.stringify({ func: "startgame", payload: "" })),
        []
    )

    const progress = () => {
        if (currentQuestion < questions.length - 1) {
            webSocket.current.send(
                JSON.stringify({ func: "progress", payload: currentQuestion + 1 })
            )
        } else {
            webSocket.current.send(JSON.stringify({ func: "endgame", payload: "" }))
            setGameFinished(true)
        }
    }

    const showTheAnswer = () => {
        webSocket.current.send(JSON.stringify({ func: "showanswer", payload: "" }))
    }

    const onAnswer = useCallback((ans) => {
        webSocket.current.send(
            JSON.stringify({
                func: "answer",
                payload: { isRight: ans, name: props.name },
            })
        )
        setIsDisabled(true)
    }, [])

    const curquest = questions[currentQuestion]
    return (
        <div>
            {gameFinished && (
                <div>
                    <div class="hero bg-base-200 pb-4 my-3">
                        <div class="hero-content text-center">
                            <div class="max-w-md">
                                <p class="py-6 text-yellow-400">Winner:</p>
                                <h1 class="text-5xl font-bold">
                                    🎉{" "}
                                    {Object.keys(finalRanking).reduce((a, b) =>
                                        finalRanking[a] > finalRanking[b] ? a : b
                                    )}{" "}
                                    🎉
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isTeacher && !gameStarted && (
                <button onClick={StartGame} className="btn btn-primary ">
                    Start Game
                </button>
            )}
            {!gameFinished && (
                <div className="alert shadow-lg my-5">
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            class="stroke-info flex-shrink-0 w-6 h-6"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                        Number of Answers: {numOfAnswers}
                    </div>
                </div>
            )}
            {!isTeacher && !gameStarted && (
                <div className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                    {" "}
                    Waiting for Teacher to Start
                </div>
            )}
            {gameStarted && (
                <div>
                    {!showAnswer && (
                        <Question
                            disabled={isTeacher || isDisabled}
                            question_text={curquest.question_text}
                            answer1={curquest.answer1}
                            answer2={curquest.answer2}
                            answer3={curquest.answer3}
                            answer4={curquest.answer4}
                            right_answer={curquest.right_answer}
                            onAnswer={onAnswer}
                        />
                    )}
                    {!gameFinished && showAnswer && (
                        <div>
                            <div>
                                <div className="hero bg-base-200">
                                    <div className="hero-content text-center">
                                        <div className="max-w-md">
                                            <p className="py-1 text-2xl">Answer:</p>
                                            <h1 className="text-5xl font-bold">
                                                {
                                                    [
                                                        curquest.answer1,
                                                        curquest.answer2,
                                                        curquest.answer3,
                                                        curquest.answer4,
                                                    ][curquest.right_answer - 1]
                                                }
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {gotItRight.map((element, i) => (
                                <div key={i}>{element}</div>
                            ))}
                        </div>
                    )}
                    {isTeacher && !showAnswer && (
                        <button
                            onClick={showTheAnswer}
                            className="mt-5 btn btn-info float-right"
                        >
                            show answer
                        </button>
                    )}
                    {!gameFinished && isTeacher && showAnswer && (
                        <button onClick={progress} className="btn btn-primary mt-3">
                            Next Question
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export default SocketHandler
