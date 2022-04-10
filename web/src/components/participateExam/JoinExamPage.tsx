import React from "react";
import { Col } from "react-bootstrap";
import { Navigate, useParams } from "react-router-dom";
import { ExamParticipation } from "../../api/exam/participation";
import { Page } from "../Page";

export const JoinExamPage = () => {
    const [message, setMessage] = React.useState("Joining exam...");
    const [participationUuid, setParticipationUuid] = React.useState("");
    const params = useParams();

    React.useEffect(() => {
        let examUuid = params.exam_uuid;
        if (!examUuid) {
            setMessage("invalid exam uuid");
            return;
        }

        ExamParticipation.handleRequest(ExamParticipation.create, examUuid).then((participation) => {
            if (typeof participation === "string") {
                setMessage(`Failed to join exam - ${participation}`);
                return;
            }

            setParticipationUuid(participation.participation_uuid);
        });
    }, []);

    if (participationUuid !== "") {
        return <Navigate to={`/participate/${participationUuid}`} />;
    }

    return (
        <Page>
            <Col xs={11} sm={11} md={10} lg={10} xl={10} className="pt-2 text-center">
                {message}
            </Col>
        </Page>
    );
};
