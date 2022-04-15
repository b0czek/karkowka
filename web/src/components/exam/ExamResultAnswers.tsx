import React from "react";
import { ListGroup, Row, Col, Button } from "react-bootstrap";
import { BsCheckLg, BsXLg } from "react-icons/bs";
import { AnswerObject } from "../../api/exam/participation/answer";

const Col4 = (props: any) => <Col className="col-4">{props.children}</Col>;
const Col3 = (props: any) => <Col className="col-3">{props.children}</Col>;

const ApproveButton = (props: ExamResultAnswerProps) => (
    <Col className="px-0 d-flex justify-content-center align-items-center">
        <Button variant="outline" className="p-2" onClick={() => props.toggleApproval!(props.idx)}>
            {props.answer.is_correct ? <BsXLg /> : <BsCheckLg />}
        </Button>
    </Col>
);

const ExamResultAnswer = (props: ExamResultAnswerProps) => {
    return (
        <ListGroup.Item className={`mt-1 border border-2 ${props.answer.is_correct ? "border-success" : "border-danger"}`}>
            <Row>
                <Col4>{props.answer.question.question}</Col4>
                <Col3>{new Date(props.answer.answered_at).toLocaleString()}</Col3>
                <Col4>{props.answer.answer}</Col4>
                {props.toggleApproval ? <ApproveButton {...props} /> : null}
            </Row>
        </ListGroup.Item>
    );
};

export const ExamResultAnswers = (props: ExamResultAnswersProps) => {
    console.log(props.toggleApproval);
    return props.answers.length > 0 ? (
        <ListGroup>
            Answers:
            <ListGroup.Item>
                <Row>
                    <Col4>Question:</Col4>
                    <Col3>Answered at:</Col3>
                    <Col4>Answer:</Col4>
                </Row>
            </ListGroup.Item>
            {props.answers.map((answer, idx) => (
                <ExamResultAnswer answer={answer} key={idx} idx={idx} toggleApproval={props.toggleApproval} />
            ))}
        </ListGroup>
    ) : null;
};

interface ExamResultAnswerProps {
    idx: number;
    toggleApproval?: (idx: number) => void;
    answer: AnswerObject;
}
interface ExamResultAnswersProps {
    answers: AnswerObject[];
    toggleApproval?: (idx: number) => void;
}
