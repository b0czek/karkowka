import React from "react";
import { Col } from "react-bootstrap";
import { QuestionListObject } from "../../api/question/list";
import { QuestionLists } from "../../api/question/list/lists";
import { Page } from "../Page";
import { QuestionListCard } from "../questionList/QuestionListCard";

export const QuestionListsPage = () => {
    const [lists, setLists] = React.useState<QuestionListObject[]>([]);

    React.useEffect(() => {
        QuestionLists.get().then((lists) => {
            setLists(lists.question_lists);
        });
    }, []);

    const onDelete = (uuid: string) => setLists(lists.filter((list) => list.uuid !== uuid));

    return (
        <Page className="pt-3">
            <Col xs={11} sm={11} md={10} lg={10} xl={10}>
                {lists
                    .filter((list) => !list.deleted)
                    .map((list, idx) => (
                        <QuestionListCard questionList={list} key={idx} onDelete={onDelete} className="my-3" />
                    ))}
            </Col>
        </Page>
    );
};
