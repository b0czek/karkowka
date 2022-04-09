import React from "react";
import { Col, ListGroup, Row } from "react-bootstrap";
import { Question, QuestionObject } from "../../api/question";

const ExamQuestion = ({ question_list_uuid, question_uuid }: { question_uuid: string; question_list_uuid: string }) => {
    const [question, setQuestion] = React.useState<QuestionObject | null>(null);

    React.useEffect(() => {
        Question.handleRequest(Question.get, {
            question_list_uuid,
            question_uuid,
        }).then((question) => {
            if (typeof question === "string") {
                return;
            }
            setQuestion(question.question);
        });
    }, []);

    if (!question) {
        return <>Loading...</>;
    }
    return (
        <Row>
            <Col xs={12} md={6} className="border py-2">
                <b>{question.question}</b>
            </Col>
            <Col xs={12} md={6} className="mt-2 mt-md-0">
                <ListGroup>
                    {question.answers.map((answer, idx) => (
                        <ListGroup.Item key={idx}>{answer}</ListGroup.Item>
                    ))}
                </ListGroup>
            </Col>
        </Row>
    );
};

export const ExamQuestions = (props: ExamQuestionsProps) => {
    return (
        <ListGroup>
            Questions:
            {props.questions.map((uuid, idx) => (
                <ListGroup.Item key={idx}>
                    <ExamQuestion question_uuid={uuid} key={idx} question_list_uuid={props.question_list_uuid} />
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

interface ExamQuestionsProps {
    question_list_uuid: string;
    questions: string[];
}
