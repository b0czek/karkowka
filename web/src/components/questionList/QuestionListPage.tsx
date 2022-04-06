import React from "react";
import { Col } from "react-bootstrap";
import { Navigate, useParams } from "react-router-dom";
import { QuestionObject } from "../../api/question";
import { QuestionList, QuestionListObject } from "../../api/question/list";
import { Page } from "../Page";
import { QuestionListCard } from "./QuestionListCard";

export const QuestionListPage = () => {
    const [questionList, setQuestionList] = React.useState<QuestionListObject | null>(null);
    const [wasDeleted, setWasDeleted] = React.useState(false);
    const params = useParams();

    React.useEffect(() => {
        let uuid = params.list_uuid;
        if (!uuid) return;

        QuestionList.get(uuid).then((list) => setQuestionList(list.question_list));
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
        <Page className="pt-3">
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