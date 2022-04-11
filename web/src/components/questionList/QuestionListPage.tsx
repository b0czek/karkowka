import React from "react";
import { Col } from "react-bootstrap";
import { Navigate, useParams } from "react-router-dom";
import { QuestionObject } from "../../api/question";
import { QuestionList, QuestionListObject } from "../../api/question/list";
import { Questions } from "../../api/question/questions";
import { errorAdd } from "../../errorContext";
import { Page } from "../Page";
import { QuestionListCard } from "./QuestionListCard";

const questionAnswersSeparators: string[] = ["-", "–", "—", "−"];
const answersSeparators: string[] = [",", ";"];

const splitWithMultipleSeparators = (str: string, separators: string[]): string[] => {
    // unify possible separators into the first one
    let [separator, ...strSeparators] = separators;
    strSeparators.forEach((s) => (str = str.replaceAll(s, separator)));
    return str.split(separator).map((str) => str.trim());
};

const handleQuestionAnswerInput = (input: string): [string, string[]] | null => {
    // try to split in question - answer,answer,...
    let [question, answers] = splitWithMultipleSeparators(input, questionAnswersSeparators);

    // there was no separator
    if (!answers) {
        return null;
    }

    let answersArray = splitWithMultipleSeparators(answers, answersSeparators);

    return [question, answersArray];
};

export const QuestionListPage = () => {
    const [questionList, _setQuestionList] = React.useState<QuestionListObject | null>(null);
    const questionListRef = React.useRef(questionList);
    const setQuestionList = (newState: QuestionListObject) => {
        questionListRef.current = newState;
        _setQuestionList(newState);
    };

    const [wasDeleted, setWasDeleted] = React.useState(false);
    const params = useParams();

    const pasteHandler = async (e: React.ClipboardEvent) => {
        let questionList = questionListRef.current;
        if (questionList === null) {
            console.log("no question list");
            return;
        }

        let clipboardData: string = e.clipboardData.getData("text/plain");
        if (!clipboardData) {
            errorAdd({
                message: "Clipboard empty!",
                type: "warning",
            });
            console.log("clipboard data empty");
            return;
        }

        let questions = clipboardData
            .split(/\r?\n/)
            .map((el) => handleQuestionAnswerInput(el))
            .filter((el) => el !== null) as [string, string[]][];

        if (questions.length === 0) {
            errorAdd({
                message: "Could not find questions in pasted text!",
                type: "warning",
            });
            return;
        }

        let res = await Questions.handleRequest(Questions.create, {
            question_list_uuid: questionList.uuid,
            questions: questions.map(([question, answers]) => ({ question, answers })),
        });
        if (typeof res === "string") {
            return;
        }

        updateQuestionList(questionList.uuid);
    };

    const updateQuestionList = (uuid: string) => {
        QuestionList.handleRequest(QuestionList.get, uuid).then((list) => {
            if (typeof list === "string") {
                return;
            }
            setQuestionList(list.question_list);
        });
    };

    React.useEffect(() => {
        let uuid = params.list_uuid;
        if (!uuid) return;

        updateQuestionList(uuid);

        // @ts-ignore
        window.removeEventListener("paste", pasteHandler);

        // @ts-ignore
        window.addEventListener("paste", (e) => pasteHandler(e));

        return () => {
            // @ts-ignore
            window.removeEventListener("paste", pasteHandler);
        };
    }, []);

    if (wasDeleted) {
        return <Navigate to="/questionLists" replace />;
    }

    if (!questionList) {
        return <Page>Loading...</Page>;
    }

    const onQuestionsAlter = (questions: QuestionObject[]) =>
        setQuestionList({
            ...questionList,
            questions: questions,
        });

    const onQuestionListDelete = () => {
        setWasDeleted(true);
    };

    return (
        <Page>
            <Col xs={11} sm={11} md={10} lg={10} xl={10}>
                {questionList ? (
                    <QuestionListCard
                        questionList={questionList}
                        with_answers={true}
                        onQuestionAlter={onQuestionsAlter}
                        onDelete={onQuestionListDelete}
                    />
                ) : null}
            </Col>
        </Page>
    );
};
