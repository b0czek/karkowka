import React from "react";
import { Col } from "react-bootstrap";
import { ParticipatedExamObject } from "../../api/user/participatedExam";
import { UserParticipatedExams } from "../../api/user/participatedExam/participatedExams";
import { Page } from "../Page";
import { ParticipatedExamCard } from "./ParticipatedExamCard";

export const ParticipatedExamsPage = () => {
    const [participatedExams, setParticipatedExams] = React.useState<ParticipatedExamObject[]>([]);

    React.useEffect(() => {
        UserParticipatedExams.handleRequest(UserParticipatedExams.get, {}).then((exams) => {
            if (typeof exams === "string") {
                return;
            }
            setParticipatedExams(exams.exams);
        });
    }, []);

    return (
        <Page>
            <Col xs={11} sm={11} md={10} lg={10} xl={10} className="space-children">
                Participated exams:
                {participatedExams.map((exam, idx) => (
                    <ParticipatedExamCard exam={exam} key={idx} />
                ))}
            </Col>
        </Page>
    );
};
