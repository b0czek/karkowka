import React from "react";
import { Card, Col, ListGroup, Row } from "react-bootstrap";
import { ExamObject } from "../../api/exam";
import { ExamParticipationObject } from "../../api/exam/participation";
import { AnswerObject } from "../../api/exam/participation/answer";
import { ExamResultAnswers } from "./ExamResultAnswers";

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
                        {props.result.answers.filter((answer) => answer.is_correct).length} / {props.exam.questions_count}
                    </b>
                </Card.Text>
                <ExamResultAnswers answers={props.result.answers} toggleApproval={props.toggleApproval} />
            </Card.Body>
        </Card>
    );
};

export interface ExamResultCardProps {
    result: ExamParticipationObject;
    exam: ExamObject;
    toggleApproval: (idx: number) => void;
}
