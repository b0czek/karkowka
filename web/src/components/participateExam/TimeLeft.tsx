import React from "react";
import { Row } from "react-bootstrap";
import { ExamParticipationObject } from "../../api/exam/participation";
import { ParticipatedExamObject, UserParticipatedExam } from "../../api/user/participatedExam";
import { formatTime } from "../utilts";

export const TimeLeft = (props: TimeLeftProps) => {
    const [exam, _setExam] = React.useState<ParticipatedExamObject | null>(null);
    const examRef = React.useRef(exam);

    const setExam = (newState: ParticipatedExamObject) => {
        examRef.current = newState;
        _setExam(newState);
    };

    const [secondsLeft, setSecondsLeft] = React.useState(0);

    const refreshClock = () => {
        if (!examRef.current) {
            return;
        }
        let joined_at = new Date(props.participation.joined_at).valueOf() / 1000;
        let closing_at = joined_at + examRef.current.duration;
        let now = new Date().valueOf() / 1000;

        let secondsLeft = Math.max(0, closing_at - now);
        setSecondsLeft(secondsLeft);

        if (secondsLeft === 0) {
            props.onTimesUp();
        }
    };

    React.useEffect(() => {
        UserParticipatedExam.handleRequest(UserParticipatedExam.get, props.participation.exam).then((exam) => {
            if (typeof exam === "string") {
                return;
            }
            setExam(exam.exam);
        });

        let refreshInterval = setInterval(refreshClock, 1000);

        return () => {
            clearInterval(refreshInterval);
        };
    }, []);

    return (
        <div className="h5 d-flex justify-content-end py-2">
            <span className="pe-1">Time left:</span>{" "}
            <span className={secondsLeft > 300 ? "text-success" : "text-warning"}>{formatTime(secondsLeft)}</span>
        </div>
    );
};

interface TimeLeftProps {
    participation: ExamParticipationObject;
    onTimesUp: () => void;
}
