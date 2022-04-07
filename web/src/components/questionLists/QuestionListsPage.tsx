import React from "react";
import { Button, Card, Col, FormControl, InputGroup } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import { Navigate } from "react-router-dom";
import { QuestionListObject } from "../../api/question/list";
import { QuestionLists } from "../../api/question/list/lists";
import { handleRequestErrorWrapper } from "../../errorContext";
import { Page } from "../Page";
import { QuestionListCard } from "../questionList/QuestionListCard";
import { QuestionListCreateCard } from "./QuestionListCreateCard";

export const QuestionListsPage = () => {
    const [lists, setLists] = React.useState<QuestionListObject[]>([]);

    React.useEffect(() => {
        handleRequestErrorWrapper(QuestionLists.get, {}).then((lists) => {
            if (typeof lists === "string") {
                return;
            }

            setLists(lists.question_lists);
        });
    }, []);

    const onDelete = (uuid: string) => setLists(lists.filter((list) => list.uuid !== uuid));

    return (
        <Page>
            <Col xs={11} sm={11} md={10} lg={10} xl={10}>
                <QuestionListCreateCard />
                {lists
                    .filter((list) => !list.deleted)
                    .map((list, idx) => (
                        <QuestionListCard questionList={list} key={idx} onDelete={onDelete} className="my-3" />
                    ))}
            </Col>
        </Page>
    );
};
