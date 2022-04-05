import React from "react";
import { Button, Card, CloseButton, Col, Container, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import { prototype } from "stream";
import { QuestionObject } from "../../api/question";
import { QuestionList, QuestionListObject } from "../../api/question/list";
import { QuestionRow } from "./QuestionRow";

interface QuestionsProps {
    questions: QuestionObject[];
    deleteQuestion: (questionIdx: number) => void;
}

const Questions = ({ questions, deleteQuestion }: QuestionsProps) => {
    return (
        <ListGroup>
            {questions.map((question, idx) => (
                <ListGroup.Item key={idx}>
                    <QuestionRow question={question} key={idx} idx={idx} onDelete={deleteQuestion} />
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

export const QuestionListCard = (props: QuestionListCardProps) => {
    let date = new Date(props.questionList.created_at);

    const questionListDelete = async () => {
        await QuestionList.delete(props.questionList.uuid);
        if (props.onDelete) props.onDelete(props.questionList.uuid);
    };

    const questionDelete = (questionIdx: number) => {
        if (!props.questionList.questions || !props.onQuestionAlter) {
            return;
        }
        props.onQuestionAlter([...props.questionList.questions].filter((_, idx) => idx !== questionIdx));
    };

    return (
        <Card className={props.className}>
            <Card.Header>
                {props.questionList.name} <CloseButton className="float-end" onClick={questionListDelete} />
            </Card.Header>
            <Card.Body>
                <Card.Text>Questions count: {props.questionList.questions_count}</Card.Text>
                <Card.Text>
                    Created at: {date.toLocaleDateString()} {date.toLocaleTimeString()}
                </Card.Text>
                {props.with_answers ? (
                    <Questions questions={props.questionList.questions!} deleteQuestion={questionDelete} />
                ) : (
                    <Link to={`/questionList/${props.questionList.uuid}`}>
                        <Button variant="primary" className="float-end col-3 col-md-2">
                            View
                        </Button>
                    </Link>
                )}
            </Card.Body>
        </Card>
    );
};

export interface QuestionListCardProps {
    questionList: QuestionListObject;
    with_answers?: boolean;
    className?: string;
    onDelete?: (list_uuid: string) => void;
    onQuestionAlter?: (questions: QuestionObject[]) => void;
}
