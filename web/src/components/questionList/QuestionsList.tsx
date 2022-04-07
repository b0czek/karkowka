import { Button, ListGroup } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import { QuestionObject } from "../../api/question";
import { QuestionRow } from "./QuestionRow";

interface QuestionsProps {
    questions: QuestionObject[];
    deleteQuestion: (questionIdx: number) => void;
    addQuestion: () => void;
}

export const QuestionsList = ({ questions, deleteQuestion, addQuestion }: QuestionsProps) => {
    return (
        <ListGroup>
            {questions.map((question, idx) => (
                <ListGroup.Item key={idx}>
                    <QuestionRow question={question} key={idx} idx={idx} onDelete={deleteQuestion} />
                </ListGroup.Item>
            ))}
            <Button variant="primary" className="w-100 mt-2" onClick={addQuestion}>
                Add question <BsPlus />
            </Button>
        </ListGroup>
    );
};
