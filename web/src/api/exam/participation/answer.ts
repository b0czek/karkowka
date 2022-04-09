import { ApiProvider, ResponseBase } from "../../provider";
import { ExamQuestionObject } from "./questions";

export class ExamParticipationAnswer extends ApiProvider {
    protected static path = "/exam/participation/answer";

    public static get = async (body: AnswerGetBody): Promise<AnswerGetResponse> => this._fetch("get", body);

    public static create = async (body: AnswerCreateBody): Promise<AnswerCreateResponse> => this._fetch("post", body);
}

interface AnswerGetBody {
    participation_uuid: string;
    answer_uuid: string;
}
interface AnswerGetResponse extends ResponseBase {
    answer: AnswerObject;
}

export interface AnswerObject {
    answered_at: string;
    answer: string;
    is_correct: boolean;
    question: ExamQuestionObject;
}

interface AnswerCreateBody {
    question_uuid: string;
    participation_uuid: string;
    answer: string;
}

interface AnswerCreateResponse extends ResponseBase {
    is_correct: boolean;
    answer_uuid: string;
}
