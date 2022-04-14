import React from "react";
import { Button, Card, CloseButton, Col, Container, Form } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { Exam } from "../../api/exam";
import { QuestionListObject } from "../../api/question/list";
import { QuestionLists } from "../../api/question/list/lists";
import { User, UserObject } from "../../api/user";
import { UserSearch } from "../../api/user/search";
import { errorAdd } from "../../errorContext";
import "./ExamCreateCard.css";

interface ExamCreationState {
    name: string;
    selectedQuestionList: string;
    questionsCount: string;
    case_sensitive: boolean;
    ignore_diacritics: boolean;
    duration: string;
    timeToJoin: string;
    startedAt: string;
    participantsInput: string;
    participants: UserObject[];
}

const initialCreationState: ExamCreationState = {
    name: "",
    questionsCount: "",
    selectedQuestionList: "",
    case_sensitive: false,
    ignore_diacritics: false,
    duration: "",
    timeToJoin: "",
    startedAt: "",
    participantsInput: "",
    participants: [],
};

export const ExamCreateCard = () => {
    const [creationState, setCreationState] = React.useReducer(
        (prevState: ExamCreationState, newState: Partial<ExamCreationState>) => ({ ...prevState, ...newState }),
        initialCreationState
    );
    const [questionLists, setQuestionLists] = React.useState<QuestionListObject[]>([]);
    const [createdExamUuid, setCreatedExamUuid] = React.useState("");

    React.useEffect(() => {
        QuestionLists.handleRequest(QuestionLists.get, {}).then((lists) => {
            if (typeof lists === "string") {
                return;
            }
            setQuestionLists(lists.question_lists);
        });
    }, []);

    if (createdExamUuid !== "") {
        return <Navigate to={`/exam/${createdExamUuid}`} />;
    }

    const setQuestionList = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCreationState({
            selectedQuestionList: e.target.value,
            questionsCount: `${Math.min(questionLists[+e.target.value].questions_count, +creationState.questionsCount)}`,
        });
    };

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCreationState({
            [e.target.name]: e.target.value,
        });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCreationState({
            [e.target.name]: e.target.checked,
        });
    };

    const examCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        let res = await Exam.handleRequest(Exam.create, {
            name: creationState.name,
            time_to_join: +creationState.timeToJoin * 60,
            duration: +creationState.duration * 60,
            started_at: new Date(creationState.startedAt).toISOString(),
            questions_count: +creationState.questionsCount,
            case_sensitive: creationState.case_sensitive,
            ignore_diacritics: creationState.ignore_diacritics,
            question_list_uuid: questionLists[+creationState.selectedQuestionList].uuid,
            participants_uuids: creationState.participants.map((participant) => participant.uuid),
        });

        if (typeof res === "string") {
            return;
        }

        setCreatedExamUuid(res.exam_uuid);
    };

    const participantsInputHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let input = e.target.value;
        while (input.includes(" ")) {
            let spacePos = input.indexOf(" ");
            let username = input.substring(0, spacePos).trim();

            // if string starts with space, then skip it
            if (username.length === 0) {
                input = input.substring(1);
            }
            if (username.length < 4) {
                errorAdd({
                    message: `invalid username ${username}`,
                    type: "warning",
                });
                break;
            }

            if (creationState.participants.some((participant) => participant.username === username)) {
                errorAdd({
                    message: `user with username ${username} already added`,
                    type: "warning",
                });
                break;
            }

            let user = await UserSearch.handleRequest(UserSearch.search, username);
            if (typeof user === "string") {
                break;
            }

            setCreationState({
                participants: [...creationState.participants, user.user],
            });
            input = input.substring(spacePos + 1);
        }
        setCreationState({
            participantsInput: input,
        });
    };

    const participantDelete = (idx: number) => {
        setCreationState({
            participants: creationState.participants.filter((_, i) => i !== idx),
        });
    };

    return (
        <Card>
            <Card.Header>Create new exam</Card.Header>
            <Card.Body>
                <Form>
                    <Col className="col-12 col-md-10 col-lg-8 space-children">
                        <Form.Group>
                            <Form.Label>Exam name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Exam name"
                                value={creationState.name}
                                onChange={onChangeHandler}
                                name="name"
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Exam duration (minutes)</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Exam duration"
                                min={0}
                                value={creationState.duration}
                                onChange={onChangeHandler}
                                name="duration"
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Time to join exam (minutes)</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Time to join exam"
                                min={0}
                                value={creationState.timeToJoin}
                                onChange={onChangeHandler}
                                name="timeToJoin"
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Started at</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                min={0}
                                value={creationState.startedAt}
                                onChange={onChangeHandler}
                                name="startedAt"
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Question list</Form.Label>
                            <Form.Select value={creationState.selectedQuestionList} onChange={setQuestionList} required>
                                <option value="" disabled hidden>
                                    Select question list
                                </option>
                                {questionLists.map((list, idx) => (
                                    <option key={idx} value={idx}>
                                        {list.name} ({list.questions_count} question{list.questions_count > 1 ? "s" : ""})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Questions count</Form.Label>
                            <Form.Control
                                type="number"
                                disabled={creationState.selectedQuestionList.length === 0}
                                placeholder="Questions count"
                                max={
                                    creationState.selectedQuestionList.length === 0
                                        ? 0
                                        : questionLists[+creationState.selectedQuestionList].questions_count
                                }
                                min={0}
                                value={creationState.questionsCount}
                                onChange={(e) => {
                                    e.target.value = Math.min(
                                        +e.target.value,
                                        questionLists[+creationState.selectedQuestionList].questions_count
                                    ).toString();
                                    onChangeHandler(e as any as React.ChangeEvent<HTMLInputElement>);
                                }}
                                name="questionsCount"
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Participants</Form.Label>
                            <div className="border">
                                <Form.Control
                                    style={{ border: "0px", borderBottom: "1px solid #ced4da" }}
                                    placeholder="Participant's username"
                                    onChange={participantsInputHandler}
                                    value={creationState.participantsInput}
                                />
                                <div className="p-3 d-flex flex-wrap">
                                    {creationState.participants.map((participant, idx) => (
                                        <ParticipantBox
                                            key={idx}
                                            idx={idx}
                                            participant={participant}
                                            onDelete={participantDelete}
                                        />
                                    ))}
                                </div>
                            </div>
                        </Form.Group>
                        <Form.Group className="d-flex flex-wrap">
                            <Form.Check
                                type="checkbox"
                                label="Case sensitive"
                                checked={creationState.case_sensitive}
                                onChange={handleCheckboxChange}
                                name="case_sensitive"
                                className="pe-3"
                            />
                            <Form.Check
                                type="checkbox"
                                label="Ignore diacritics"
                                checked={creationState.ignore_diacritics}
                                onChange={handleCheckboxChange}
                                name="ignore_diacritics"
                            />
                        </Form.Group>
                    </Col>
                    <Button className="float-end mt-3" type="submit" onClick={examCreate}>
                        Create exam
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

const ParticipantBox = (props: ParticipantBoxProps) => {
    return (
        <div className="border p-2 m-1 d-flex justify-content-center align-items-center">
            <b>{props.participant.name}</b> <span className="ps-1">({props.participant.username})</span>
            <CloseButton className="ms-3" onClick={(e) => props.onDelete(props.idx)} />
        </div>
    );
};

interface ParticipantBoxProps {
    participant: UserObject;
    idx: number;
    onDelete: (idx: number) => void;
}
