import React from "react";
import { Button, Col, ListGroup, Row } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { ExamResultState, ExamResultStateGetResponse } from "../../api/exam/result/state";
import { User, UserObject } from "../../api/user";

const ExamParticipant = (props: { participant_uuid: string; exam_uuid: string }) => {
    const [participant, setParticipant] = React.useState<UserObject | null>(null);
    const [resultState, setResultState] = React.useState<ExamResultStateGetResponse | null>(null);
    const [shouldRedirect, setShouldRedirect] = React.useState(false);

    React.useEffect(() => {
        User.handleRequest(User.get, {
            user_uuid: props.participant_uuid,
        }).then((user) => {
            if (typeof user === "string") {
                return;
            }
            setParticipant(user.user);
        });

        ExamResultState.handleRequest(ExamResultState.get, {
            user_uuid: props.participant_uuid,
            exam_uuid: props.exam_uuid,
        }).then((state) => {
            if (typeof state === "string") {
                return;
            }
            setResultState(state);
        });
    }, []);

    if (!participant || !resultState) {
        return <>Loading...</>;
    }
    if (shouldRedirect) {
        return <Navigate to={`/exam/${props.exam_uuid}/result/${participant.uuid}`} />;
    }
    return (
        <>
            <span>
                <b>{participant.name}</b> ({participant.username})
            </span>
            <span className="float-end">
                <Button
                    disabled={!resultState.joined}
                    variant={resultState.joined ? "primary" : "outline-primary"}
                    onClick={() => setShouldRedirect(true)}
                >
                    {resultState.joined ? (resultState.finished ? "finished" : "in progress") : "didn't join"}
                </Button>
            </span>
        </>
    );
};

export const ExamParticipants = (props: { participants_uuids: string[]; exam_uuid: string }) => {
    return (
        <ListGroup>
            Participants:
            {props.participants_uuids.map((uuid, idx) => (
                <ListGroup.Item key={idx} className="p-3">
                    <ExamParticipant participant_uuid={uuid} key={idx} exam_uuid={props.exam_uuid} />
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};
