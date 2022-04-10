import React from "react";
import { Button, Card, FormControl, InputGroup } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import { Navigate } from "react-router-dom";
import { QuestionList } from "../../api/question/list";

export const QuestionListCreateCard = () => {
    const [questionListName, setQuestionListName] = React.useState("");
    const [questionListUuid, setQuestionListUuid] = React.useState<string | null>(null);

    const createList = async (e: React.FormEvent) => {
        e.preventDefault();
        let response = await QuestionList.handleRequest(QuestionList.create, {
            name: questionListName,
            questions: [],
        });

        if (typeof response === "string") {
            return;
        }

        setQuestionListUuid(response.question_list_uuid);
    };

    if (questionListUuid !== null) {
        return <Navigate to={`/questionList/${questionListUuid}`} />;
    }

    return (
        <Card>
            <Card.Header>Create new question list</Card.Header>
            <Card.Body>
                <InputGroup>
                    <FormControl
                        placeholder="Question list name"
                        value={questionListName}
                        onChange={(e) => setQuestionListName(e.target.value)}
                        required
                    />

                    <Button className="float-end" type="submit" onClick={createList}>
                        Create new list <BsPlus />
                    </Button>
                </InputGroup>
            </Card.Body>
        </Card>
    );
};
