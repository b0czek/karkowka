import React from "react";
import { Button, Card } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { ExamParticipation, ExamParticipationObject } from "../../api/exam/participation";
import { User, UserObject } from "../../api/user";
import { ParticipatedExamObject } from "../../api/user/participatedExam";
import { formatTime } from "../utilts";
import { ParticipatedExamCardResult } from "./ParticipatedExamCardResult";

export const ParticipatedExamCard = (props: ParticipatedExamCardProps) => {
    const [examHost, setExamHost] = React.useState<UserObject | null>(null);
    const [examParticipation, setExamParticipation] = React.useState<ExamParticipationObject | null>(null);

    React.useEffect(() => {
        User.handleRequest(User.get, { user_uuid: props.exam.hosted_by }).then((user) => {
            if (typeof user === "string") {
                return;
            }
            setExamHost(user.user);
        });
    }, [props.exam.hosted_by]);

    React.useEffect(() => {
        if (!props.exam.participation_uuid) {
            return setExamParticipation(null);
        }
        ExamParticipation.handleRequest(ExamParticipation.get, props.exam.participation_uuid).then((participation) => {
            if (typeof participation === "string") {
                return;
            }
            setExamParticipation(participation.exam_participation);
        });
    }, [props.exam.participation_uuid]);

    return (
        <Card>
            <Card.Header>{props.exam.name}</Card.Header>
            <Card.Body>
                <Card.Text>
                    Started at: <b>{new Date(props.exam.started_at).toLocaleString()}</b>
                </Card.Text>
                <Card.Text>
                    Created at: <b>{new Date(props.exam.created_at).toLocaleString()}</b>
                </Card.Text>
                <Card.Text>
                    Exam duration: <b>{formatTime(props.exam.duration)}</b>
                </Card.Text>
                <Card.Text>
                    Time to join exam: <b>{formatTime(props.exam.time_to_join)}</b>
                </Card.Text>
                <Card.Text>
                    Questions count: <b>{props.exam.questions_count}</b>
                </Card.Text>

                <Card.Text>
                    Hosted by:{" "}
                    {examHost ? (
                        <>
                            <b>{examHost.name}</b> ({examHost.username})
                        </>
                    ) : (
                        "Loading..."
                    )}
                </Card.Text>
                {props.results ? (
                    <ParticipatedExamCardResult exam={props.exam} participation={examParticipation} />
                ) : (
                    <ParticipatedExamButton exam={props.exam} participation={examParticipation} />
                )}
            </Card.Body>
        </Card>
    );
};

export interface ParticipatedExamCardProps {
    exam: ParticipatedExamObject;
    results?: true;
}

const ParticipatedExamButton = (props: ParticipatedExamButtonProps) => {
    const [navigateTo, setNavigateTo] = React.useState("");

    if (navigateTo !== "") {
        return <Navigate to={navigateTo} />;
    }

    const getButtonProps = (): ButtonProps => {
        let now = new Date().valueOf();
        let exam_start_date = new Date(props.exam.started_at).valueOf();
        let exam_join_end_date = exam_start_date + props.exam.time_to_join * 1000;
        if (!props.exam.joined) {
            if (exam_start_date > now) {
                return {
                    disabled: true,
                    label: "Exam didn't start yet",
                    navigateTo: "",
                };
            } else if (exam_join_end_date > now) {
                return {
                    disabled: false,
                    label: "Join now",
                    navigateTo: `/join/${props.exam.uuid}`,
                };
            } else {
                return {
                    disabled: true,
                    label: "Timed out",
                    navigateTo: "",
                };
            }
        }

        if (!props.participation) {
            return {
                disabled: true,
                label: "Loading...",
                navigateTo: "",
            };
        }

        if (props.participation!.finished_at === null) {
            return {
                disabled: false,
                label: "Rejoin",
                navigateTo: `/participate/${props.participation!.uuid}`,
            };
        } else {
            return {
                disabled: false,
                label: "View results",
                navigateTo: `/result/${props.participation.uuid}`,
            };
        }
    };
    const buttonProps = getButtonProps();

    return (
        <Button className="float-end" disabled={buttonProps.disabled} onClick={(_) => setNavigateTo(buttonProps.navigateTo)}>
            {buttonProps.label}
        </Button>
    );
};

interface ButtonProps {
    disabled: boolean;
    navigateTo: string;
    label: string;
}

interface ParticipatedExamButtonProps {
    exam: ParticipatedExamObject;
    participation: ExamParticipationObject | null;
}
