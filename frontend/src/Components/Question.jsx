const Question = (props) => {
    const isRight = (ans) => {
        props.onAnswer(props.right_answer == ans)
    }

    return (
        <div>
            <div className="hero bg-base-200 mb-6">
                <div className="hero-content text-center py-20">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">{props.question_text}</h1>
                    </div>
                </div>
            </div>
            <ul>
                <li
                    onClick={() => isRight(1)}
                    className="btn btn-wide w-full mt-3 btn-error text-white"
                    disabled={props.disabled}
                >
                    {props.answer1}
                </li>
                <li
                    className="btn btn-wide btn-secondary w-full mt-3"
                    disabled={props.disabled}
                    onClick={() => isRight(2)}
                >
                    {props.answer2}
                </li>
                <li
                    className="btn btn-wide btn-accent w-full mt-3"
                    disabled={props.disabled}
                    onClick={() => isRight(3)}
                >
                    {props.answer3}
                </li>
                <li
                    className="btn btn-wide w-full mt-3 btn-primary"
                    disabled={props.disabled}
                    onClick={() => isRight(4)}
                >
                    {props.answer4}
                </li>
            </ul>
        </div>
    )
}

export default Question
