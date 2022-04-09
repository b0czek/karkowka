import React from "react";
import { Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Exam, ExamObject } from "../../api/exam";
import { Page } from "../Page";
import { ExamCard } from "./ExamCard";

export const ExamPage = () => {
    const [exam, setExam] = React.useState<ExamObject | null>(null);
    const params = useParams();

    React.useEffect(() => {
        let examUuid = params.exam_uuid;
        if (!examUuid) {
            return;
        }
        Exam.handleRequest(Exam.get, examUuid).then((exam) => {
            if (typeof exam === "string") {
                return;
            }

            setExam(exam.exam);
        });
    }, []);

    return (
        <Page>
            <Col xs={11} sm={11} md={10} lg={10} xl={10}>
                {exam ? <ExamCard exam={exam} detailed /> : null}
            </Col>
        </Page>
    );
};
