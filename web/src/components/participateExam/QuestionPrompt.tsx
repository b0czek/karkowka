import React from "react";
import { Button, Form } from "react-bootstrap";
import { AnswerObject, ExamParticipationAnswer } from "../../api/exam/participation/answer";
import { ExamQuestionObject } from "../../api/exam/participation/questions";
import { errorAdd } from "../../errorContext";

export const QuestionPrompt = (props: QuestionPromptProps) => {
    const [answer, setAnswer] = React.useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (answer.length === 0) {
            errorAdd({
                message: "answer must not be empty",
                type: "warning",
            });
            return;
        }

        let response = await ExamParticipationAnswer.handleRequest(ExamParticipationAnswer.create, {
            participation_uuid: props.participation_uuid,
            question_uuid: props.question.uuid,
            answer,
        });

        if (typeof response === "string") {
            return;
        }
        setAnswer("");
        props.onSubmit({
            uuid: response.answer_uuid,
            answered_at: new Date().toISOString(),
            answer,
            is_correct: response.is_correct,
            question: {
                question: props.question.question,
                uuid: props.question.uuid,
            },
        });
    };

    return (
        <div>
            <Form>
                <div className="text-center border bg-light p-4 rounded h2">{props.question.question}</div>
                <Form.Group>
                    <Form.Label>Answer:</Form.Label>
                    <Form.Control type="text" placeholder={"Answer"} value={answer} onChange={(e) => setAnswer(e.target.value)} />
                </Form.Group>
                <Button className="w-100 mt-3" type="submit" onClick={handleSubmit}>
                    {props.isLastQuestion ? "Finish exam" : "Submit answer"}
                </Button>
            </Form>
        </div>
    );
};

export interface QuestionPromptProps {
    participation_uuid: string;
    question: ExamQuestionObject;
    onSubmit: (answer: AnswerObject) => void;
    isLastQuestion: boolean;
}
