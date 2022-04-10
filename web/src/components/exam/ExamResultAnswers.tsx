import React from "react";
import { ListGroup, Row, Col } from "react-bootstrap";
import { AnswerObject } from "../../api/exam/participation/answer";

const ExamResultAnswer = (props: ExamResultAnswerProps) => {
    return (
        <ListGroup.Item className={`mt-1 border border-2 ${props.answer.is_correct ? "border-success" : "border-danger"}`}>
            <Row>
                <Col>{props.answer.question.question}</Col>
                <Col>{new Date(props.answer.answered_at).toLocaleString()}</Col>
                <Col>{props.answer.answer}</Col>
            </Row>
        </ListGroup.Item>
    );
};

const ExamResultHeader = () => {
    return (
        <ListGroup.Item>
            <Row>
                <Col>Question:</Col>
                <Col>Answered at:</Col>
                <Col>Answer:</Col>
            </Row>
        </ListGroup.Item>
    );
};

export const ExamResultAnswers = (props: ExamResultAnswersProps) => {
    return props.answers.length > 0 ? (
        <ListGroup>
            Answers:
            <ExamResultHeader />
            {props.answers.map((answer, idx) => (
                <ExamResultAnswer answer={answer} key={idx} />
            ))}
        </ListGroup>
    ) : null;
};

interface ExamResultAnswerProps {
    answer: AnswerObject;
}
interface ExamResultAnswersProps {
    answers: AnswerObject[];
}
