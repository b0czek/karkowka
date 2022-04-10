import React from "react";
import { Button, Card, CloseButton } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Question, QuestionObject } from "../../api/question";
import { QuestionList, QuestionListObject } from "../../api/question/list";
import { QuestionsList } from "./QuestionsList";

export const QuestionListCard = (props: QuestionListCardProps) => {
    let date = new Date(props.questionList.created_at);

    const questionListDelete = async () => {
        let res = await Question.handleRequest(QuestionList.delete, props.questionList.uuid);
        if (typeof res === "string") {
            return;
        }
        if (props.onDelete) props.onDelete(props.questionList.uuid);
    };

    const questionDelete = (questionIdx: number) => {
        if (!props.questionList.questions || !props.onQuestionAlter) {
            return;
        }
        props.onQuestionAlter([...props.questionList.questions].filter((_, idx) => idx !== questionIdx));
    };

    const questionAdd = async () => {
        let createResponse = await Question.handleRequest(Question.create, {
            answers: ["Answer"],
            question: "Question",
            question_list_uuid: props.questionList.uuid,
        });
        if (typeof createResponse === "string") {
            return;
        }

        let question = await Question.handleRequest(Question.get, {
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

    const questionSave = (oldUuid: string, newQuestion: QuestionObject) => {
        let questionIdx = props.questionList.questions!.findIndex((question) => question.uuid === oldUuid);
        console.log(questionIdx);
        let newQuestions = [
            ...props.questionList.questions!.slice(0, questionIdx),
            newQuestion,
            ...props.questionList.questions!.slice(questionIdx + 1),
        ];
        if (props.onQuestionAlter) {
            // let newQuestions = props.questionList.questions!.splice(questionIdx, 1, newQuestion);
            console.log(newQuestions);
            props.onQuestionAlter(newQuestions);
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
                <Card.Text>Created at: {date.toLocaleString()}</Card.Text>
                {props.with_answers ? (
                    <QuestionsList
                        questions={props.questionList.questions!}
                        deleteQuestion={questionDelete}
                        addQuestion={questionAdd}
                        saveQuestion={questionSave}
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
