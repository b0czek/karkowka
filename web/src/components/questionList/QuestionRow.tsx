import React from "react";
import { Button, Col, Form, FormControl, InputGroup, Row } from "react-bootstrap";
import { Question, QuestionObject } from "../../api/question";
import { BsX, BsPlus, BsXLg, BsCheckLg } from "react-icons/bs";
import { useParams } from "react-router-dom";

const Answer = (props: AnswerProps) => {
    return (
        <InputGroup className="mb-1">
            <FormControl
                placeholder={`Answer #${props.idx + 1}`}
                value={props.answer}
                key={props.idx}
                onChange={(e) => props.onChange(e.target.value, props.idx)}
            />
            <Button variant="outline-danger" onClick={(e) => props.onDelete(props.idx)}>
                <BsX />
            </Button>
        </InputGroup>
    );
};

export const QuestionRow = (props: QuestionProps) => {
    const params = useParams();
    const [state, dispatch] = React.useReducer(
        (state: QuestionState, newState: Partial<QuestionState>) => ({
            ...state,
            ...newState,
        }),
        {
            question: props.question.question,
            answers: props.question.answers,
            wasEdited: false,
        }
    );

    const onQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            question: e.target.value,
            wasEdited: true,
        });
    };

    const onAnswerChange = (newValue: string, idx: number) => {
        let newAnswers = [...state.answers];
        newAnswers[idx] = newValue;
        dispatch({
            answers: newAnswers,
            wasEdited: true,
        });
    };
    const onAnswerDelete = (idx: number) => {
        dispatch({ wasEdited: true, answers: [...state.answers].filter((_, i) => i !== idx) });
    };

    const onAnswerAdd = () => dispatch({ wasEdited: true, answers: [...state.answers, ""] });

    const onQuestionSave = async () => {
        let res = await Question.handleRequest(Question.edit, {
            answers: state.answers,
            question: state.question,
            question_list_uuid: params.list_uuid!,
            question_uuid: props.question.uuid,
        });
        if (typeof res === "string") {
            return;
        }

        dispatch({ wasEdited: false });
    };

    const onQuestionDelete = async () => {
        let res = await Question.handleRequest(Question.delete, {
            question_list_uuid: params.list_uuid!,
            question_uuid: props.question.uuid,
        });
        if (typeof res === "string") {
            return;
        }

        dispatch({ wasEdited: false });
        props.onDelete(props.idx);
    };

    return (
        <Row>
            <Col xs={12} md={6}>
                <Form.Control
                    as="textarea"
                    style={{ resize: "none" }}
                    className="h-100"
                    placeholder="Question"
                    value={state.question}
                    onChange={onQuestionChange}
                />
            </Col>
            <Col xs={10} md={5} className={"pt-3 pt-md-0"}>
                {state.answers.map((answer, idx) => (
                    <Answer answer={answer} key={idx} onChange={onAnswerChange} onDelete={onAnswerDelete} idx={idx} />
                ))}
                <Button variant="outline-primary" className="w-100" onClick={onAnswerAdd}>
                    Add answer <BsPlus />
                </Button>
            </Col>
            <Col className="px-0 d-flex justify-content-center align-items-center">
                <Button variant="outline" className="p-2" onClick={state.wasEdited ? onQuestionSave : onQuestionDelete}>
                    {state.wasEdited ? <BsCheckLg /> : <BsXLg />}
                </Button>
            </Col>
        </Row>
    );
};

interface QuestionProps {
    question: QuestionObject;
    idx: number;
    onDelete: (idx: number) => void;
}
interface QuestionState {
    question: string;
    answers: string[];
    wasEdited: boolean;
}

interface AnswerProps {
    answer: string;
    idx: number;
    onChange: (newValue: string, idx: number) => void;
    onDelete: (idx: number) => void;
}
