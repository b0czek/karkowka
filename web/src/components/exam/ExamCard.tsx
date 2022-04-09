import React from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ExamObject } from "../../api/exam";
import { ExamParticipants } from "./ExamParticipants";
import { ExamQuestions } from "./ExamQuestions";

interface ExamCardDetailedProps {
    exam: ExamObject;
}

const ExamCardDetailed = (props: ExamCardDetailedProps) => {
    return (
        <>
            <ExamParticipants participants_uuids={props.exam.participants} exam_uuid={props.exam.uuid} />
            <ExamQuestions questions={props.exam.questions} question_list_uuid={props.exam.question_list} />
        </>
    );
};

export const ExamCard = (props: ExamCardProps) => {
    let createdAt = new Date(props.exam.created_at);
    let startedAt = new Date(props.exam.started_at);

    return (
        <Card className={props.className}>
            <Card.Header>{props.exam.name}</Card.Header>
            <Card.Body>
                <Card.Text>
                    Started at: <b>{startedAt.toLocaleString()}</b>
                </Card.Text>
                <Card.Text>
                    Created at: <b>{createdAt.toLocaleString()}</b>
                </Card.Text>
                <Card.Text>
                    Duration: <b>{props.exam.duration} seconds</b>
                </Card.Text>
                <Card.Text>
                    Time to join: <b>{props.exam.time_to_join} seconds</b>
                </Card.Text>
                <Card.Text>
                    Questions count: <b>{props.exam.questions_count}</b>
                </Card.Text>
                <Card.Text>
                    Participants count: <b>{props.exam.participants.length}</b>
                </Card.Text>
                {props.detailed ? (
                    <ExamCardDetailed exam={props.exam} />
                ) : (
                    <Link to={`/exam/${props.exam.uuid}`}>
                        <Button variant="primary" className="float-end col-3 col-md-2">
                            View
                        </Button>
                    </Link>
                )}
            </Card.Body>
        </Card>
    );
};

export interface ExamCardProps {
    exam: ExamObject;
    detailed?: true;
    className?: string;
}
