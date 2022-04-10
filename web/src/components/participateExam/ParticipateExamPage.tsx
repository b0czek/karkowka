import React from "react";
import { Col, ProgressBar } from "react-bootstrap";
import { Navigate, useParams } from "react-router-dom";
import { ExamParticipation, ExamParticipationObject } from "../../api/exam/participation";
import { AnswerObject } from "../../api/exam/participation/answer";
import { ExamParticipationQuestions, ExamQuestionObject } from "../../api/exam/participation/questions";
import { Page } from "../Page";
import { AnswerProgressBar } from "./AnswerProgressBar";
import { QuestionPrompt } from "./QuestionPrompt";

export const ParticipateExamPage = () => {
    const [participation, setParticipation] = React.useState<ExamParticipationObject | null>(null);
    const [questions, setQuestions] = React.useState<ExamQuestionObject[]>([]);
    const [questionsCount, setQuestionsCount] = React.useState(1);
    const [shouldRedirect, setShouldRedirect] = React.useState(false);
    const params = useParams();

    React.useEffect(() => {
        let participationUuid = params.participation_uuid;
        if (!participationUuid) {
            return;
        }

        ExamParticipation.handleRequest(ExamParticipation.get, participationUuid).then(async (participation) => {
            if (typeof participation === "string") {
                return;
            }

            setParticipation(participation.exam_participation);

            let questions = await ExamParticipationQuestions.handleRequest(ExamParticipationQuestions.get, participationUuid!);
            if (typeof questions === "string") {
                return;
            }

            setQuestionsCount(questions.questions.length);

            // filter out already answered questions
            setQuestions(
                questions.questions.filter(
                    (question) =>
                        !participation.exam_participation.answers.some((answer) => answer.question.uuid === question.uuid)
                )
            );
        });
    }, []);

    const onQuestionSubmit = (answer: AnswerObject) => {
        if (questions.length === 1) {
            setShouldRedirect(true);
        }

        setQuestions(questions.filter((question) => question.uuid !== answer.question.uuid));
        if (!participation) {
            return;
        }
        setParticipation({
            ...participation,
            answers: [...participation.answers, answer],
        });
    };

    if (!participation || questions.length === 0) {
        return (
            <Page>
                <Col xs={11} sm={11} md={10} lg={10} xl={10}>
                    Loading...
                </Col>
            </Page>
        );
    }
    if (shouldRedirect) {
        return <Navigate to={`/result/${participation.uuid}`} />;
    }

    return (
        <Page>
            <Col xs={11} sm={11} md={10} lg={10} xl={10}>
                <AnswerProgressBar participation={participation} questionsCount={questionsCount} />
                <QuestionPrompt
                    onSubmit={onQuestionSubmit}
                    question={questions[0]}
                    isLastQuestion={questions.length === 1}
                    participation_uuid={participation.uuid}
                />
            </Col>
        </Page>
    );
};
