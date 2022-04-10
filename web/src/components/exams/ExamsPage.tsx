import React from "react";
import { Col } from "react-bootstrap";
import { Exam, ExamObject } from "../../api/exam";
import { Exams } from "../../api/exam/exams";
import { Page } from "../Page";
import { ExamCard } from "../exam/ExamCard";
import { ExamCreateCard } from "../exam/ExamCreateCard";

export const ExamsPage = () => {
    const [exams, setExams] = React.useState<ExamObject[]>([]);

    React.useEffect(() => {
        Exams.handleRequest(Exams.get, {}).then(async (res) => {
            if (typeof res === "string") {
                return;
            }

            let e = (await Promise.all(res.exams_uuids.map((uuid) => Exam.handleRequest(Exam.get, uuid))))
                .map((exam) => (typeof exam === "string" ? null : exam.exam))
                .filter((exam) => exam !== null) as ExamObject[];

            setExams(e);
        });
    }, []);

    const onExamDelete = (exam_uuid: string) => {
        setExams(exams.filter((exam) => exam.uuid !== exam_uuid));
    };

    return (
        <Page>
            <Col xs={11} sm={11} md={10} lg={10} xl={10}>
                <ExamCreateCard />
                <hr />
                {exams.map((exam, idx) => (
                    <ExamCard key={idx} exam={exam} className="mb-3" onDelete={onExamDelete} />
                ))}
            </Col>
        </Page>
    );
};
