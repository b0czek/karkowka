import React from "react";
import { ProgressBar } from "react-bootstrap";
import { ExamParticipationObject } from "../../api/exam/participation";

export const AnswerProgressBar = (props: AnswerProgressBarProps) => {
    return (
        <ProgressBar className="mb-3" label={`${props.participation.answers.length} / ${props.questionsCount}`}>
            {props.participation.answers.map((answer, idx) => (
                <ProgressBar
                    key={idx}
                    variant={answer.is_correct ? "success" : "danger"}
                    now={(1 / props.questionsCount) * 100}
                />
            ))}
        </ProgressBar>
    );
};

export interface AnswerProgressBarProps {
    participation: ExamParticipationObject;
    questionsCount: number;
}
