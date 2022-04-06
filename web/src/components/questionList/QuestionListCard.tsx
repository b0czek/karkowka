import React from "react";
import { Button, Card, CloseButton, Col, Container, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import { Link, Navigate } from "react-router-dom";
import { prototype } from "stream";
import { Question, QuestionObject } from "../../api/question";
import { QuestionList, QuestionListObject } from "../../api/question/list";
import { handleRequestErrorWrapper } from "../../errorContext";
import { QuestionRow } from "./QuestionRow";
interface QuestionsProps {
    questions: QuestionObject[];
    deleteQuestion: (questionIdx: number) => void;
    addQuestion: () => void;
}

const Questions = ({ questions, deleteQuestion, addQuestion }: QuestionsProps) => {
    return (
        <ListGroup>
            {questions.map((question, idx) => (
                <ListGroup.Item key={idx}>
                    <QuestionRow question={question} key={idx} idx={idx} onDelete={deleteQuestion} />
                </ListGroup.Item>
            ))}
            <ListGroup.Item>
                <Button variant="primary" className="w-100" onClick={addQuestion}>
                    <BsPlus />
                </Button>
            </ListGroup.Item>
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

    const questionAdd = async () => {
        let createResponse = await handleRequestErrorWrapper(Question.create, {
            answers: ["Answer"],
            question: "Question",
            question_list_uuid: props.questionList.uuid,
        });
        if (typeof createResponse === "string") {
            return;
        }

        let question = await handleRequestErrorWrapper(Question.get, {
            question_list_uuid: props.questionList.uuid,
            question_uuid: createResponse.question_uuid,
        });
        if (typeof question === "string") {
            return;
        }
        question.question.answers = [""];
        question.question.question = "";

        if (props.onQuestionAlter) {
            props.onQuestionAlter([...props.questionList.questions!, question.question]);
        }
    };

    return (
        <Card className={props.className}>
            <Card.Header>
                {props.questionList.name} <CloseButton className="float-end" onClick={questionListDelete} />
            </Card.Header>
            <Card.Body>
                <Card.Text>
                    Questions count: {props.questionList.questions?.length ?? props.questionList.questions_count}
                </Card.Text>
                <Card.Text>
                    Created at: {date.toLocaleDateString()} {date.toLocaleTimeString()}
                </Card.Text>
                {props.with_answers ? (
                    <Questions
                        questions={props.questionList.questions!}
                        deleteQuestion={questionDelete}
                        addQuestion={questionAdd}
                    />
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
