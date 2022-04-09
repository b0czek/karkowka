import React from "react";
import { Card, Col, ListGroup, Row } from "react-bootstrap";
import { ExamObject } from "../../api/exam";
import { ExamParticipationObject } from "../../api/exam/participation";
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

const ExamResultAnswers = (props: ExamResultAnswersProps) => {
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

export const ExamResultCard = (props: ExamResultCardProps) => {
    return (
        <Card>
            <Card.Header>Exam result - {props.exam.name}</Card.Header>
            <Card.Body>
                <Card.Text>
                    Joined at: <b>{new Date(props.result.joined_at).toLocaleString()}</b>
                </Card.Text>
                <Card.Text>
                    Finished at:{" "}
                    <b>{props.result.finished_at ? new Date(props.result.finished_at).toLocaleString() : "not yet"}</b>
                </Card.Text>
                <Card.Text>
                    Submitted answers: <b>{props.result.answers.length}</b>
                </Card.Text>
                <Card.Text>
                    Correct answers:{" "}
                    <b>
                        {props.result.correct_answers_count} / {props.exam.questions_count}
                    </b>
                </Card.Text>
                <ExamResultAnswers answers={props.result.answers} />
            </Card.Body>
        </Card>
    );
};

export interface ExamResultCardProps {
    result: ExamParticipationObject;
    exam: ExamObject;
}

interface ExamResultAnswerProps {
    answer: AnswerObject;
}

interface ExamResultAnswersProps {
    answers: AnswerObject[];
}
