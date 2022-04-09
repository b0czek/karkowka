import React from "react";
import { Exam, ExamObject } from "../../api/exam";
import { Exams } from "../../api/exam/exams";

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

    return <></>;
};
