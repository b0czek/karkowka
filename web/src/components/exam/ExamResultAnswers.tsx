import React from "react";
import { ListGroup, Row, Col } from "react-bootstrap";
import { AnswerObject } from "../../api/exam/participation/answer";

const ExamResultAnswer = (props: ExamResultAnswerProps) => {
    return (
        <ListGroup.Item className={`mt-1 border border-2 ${props.answer.is_correct ? "border-success" : "border-danger"}`}>
            <Row>
                <Col className="col-4">{props.answer.question.question}</Col>
                <Col className="col-4">{new Date(props.answer.answered_at).toLocaleString()}</Col>
                <Col className="col-4">{props.answer.answer}</Col>
            </Row>
        </ListGroup.Item>
    );
};

const ExamResultHeader = () => {
    return (
        <ListGroup.Item>
            <Row>
                <Col className="col-4">Question:</Col>
                <Col className="col-4">Answered at:</Col>
                <Col className="col-4">Answer:</Col>
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
