import React from "react";
import { Card } from "react-bootstrap";
import { ExamParticipationObject } from "../../api/exam/participation";
import { ParticipatedExamObject } from "../../api/user/participatedExam";
import { ExamResultAnswers } from "../exam/ExamResultAnswers";

export const ParticipatedExamCardResult = (props: ParticipatedExamCardResultProps) => {
    if (!props.participation) {
        return <>Loading...</>;
    }

    let finishedAtString = props.participation.finished_at
        ? new Date(props.participation.finished_at).toLocaleString()
        : "not yet";
    return (
        <>
            <Card.Text>
                Joined at: <b>{new Date(props.participation.joined_at).toLocaleString()}</b>
            </Card.Text>
            <Card.Text>
                Finished at: <b>{finishedAtString}</b>
            </Card.Text>

            <Card.Text>
                Submitted answers: <b>{props.participation.answers.length}</b>
            </Card.Text>
            <Card.Text>
                Correct answers:{" "}
                <b>
                    {props.participation.correct_answers_count} / {props.exam.questions_count}
                </b>
            </Card.Text>
            <ExamResultAnswers answers={props.participation.answers} />
        </>
    );
};

interface ParticipatedExamCardResultProps {
    exam: ParticipatedExamObject;
    participation: ExamParticipationObject | null;
}
