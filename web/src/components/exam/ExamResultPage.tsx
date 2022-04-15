import React from "react";
import { Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Exam, ExamObject } from "../../api/exam";
import { ExamParticipationObject } from "../../api/exam/participation";
import { ExamResult } from "../../api/exam/result";
import { ExamResultAnswerApprove } from "../../api/exam/result/answer/approve";
import { Page } from "../Page";
import { ExamResultCard } from "./ExamResultCard";

export const ExamResultPage = () => {
    const [examResult, setExamResult] = React.useState<ExamParticipationObject | null>(null);
    const [exam, setExam] = React.useState<ExamObject | null>(null);
    const params = useParams();

    React.useEffect(() => {
        if (!params.exam_uuid || !params.user_uuid) {
            return;
        }

        Exam.handleRequest(Exam.get, params.exam_uuid).then((exam) => {
            if (typeof exam === "string") {
                return;
            }
            setExam(exam.exam);
        });

        ExamResult.handleRequest(ExamResult.get, {
            exam_uuid: params.exam_uuid,
            user_uuid: params.user_uuid,
        }).then((examResult) => {
            if (typeof examResult === "string") {
                return;
            }
            setExamResult(examResult.result);
        });
    }, []);

    const toggleAnswerApproval = async (answerIdx: number) => {
        if (!examResult) {
            return;
        }
        let answer = examResult.answers[answerIdx];
        let isCorrect = !answer.is_correct;
        let res = await ExamResultAnswerApprove.handleRequest(ExamResultAnswerApprove.post, {
            participation_uuid: examResult.uuid,
            answer_uuid: answer.uuid,
            is_correct: isCorrect,
        });

        if (typeof res === "string") {
            return;
        }

        setExamResult({
            ...examResult,
            answers: examResult.answers.map((answer, idx) => (idx === answerIdx ? { ...answer, is_correct: isCorrect } : answer)),
        });
    };

    return (
        <Page>
            <Col xs={11} sm={11} md={10} lg={10} xl={10}>
                {examResult && exam ? (
                    <ExamResultCard result={examResult} exam={exam} toggleApproval={toggleAnswerApproval} />
                ) : (
                    "Loading..."
                )}
            </Col>
        </Page>
    );
};
