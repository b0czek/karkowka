import React from "react";
import { Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { ExamParticipation } from "../../api/exam/participation";
import { ParticipatedExamObject, UserParticipatedExam } from "../../api/user/participatedExam";
import { Page } from "../Page";
import { ParticipatedExamCard } from "./ParticipatedExamCard";

export const ParticipatedExamResultPage = () => {
    const [exam, setExam] = React.useState<ParticipatedExamObject | null>(null);
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
            let res = await UserParticipatedExam.handleRequest(UserParticipatedExam.get, participation.exam_participation.exam);
            if (typeof res === "string") {
                return;
            }
            setExam(res.exam);
        });
    }, []);

    return (
        <Page>
            <Col xs={11} sm={11} md={10} lg={10} xl={10}>
                {exam ? <ParticipatedExamCard exam={exam} results /> : "Loading..."}
            </Col>
        </Page>
    );
};
