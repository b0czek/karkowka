import { ApiProvider, ResponseBase } from "../provider";

export class Question extends ApiProvider {
    protected static path = "/question";

    public static get = async (body: QuestionGetBody): Promise<QuestionGetResponse> => super._fetch("get", body);
    public static create = async (body: QuestionPostBody): Promise<QuestionPostResponse> => super._fetch("post", body);
    public static delete = async (body: QuestionDeleteBody): Promise<ResponseBase> => super._fetch("delete", body);
    public static edit = async (body: QuestionEditBody): Promise<QuestionEditResponse> => super._fetch("patch", body);
}

interface QuestionGetBody {
    question_list_uuid: string;
    question_uuid: string;
}

interface QuestionGetResponse extends ResponseBase {
    question: QuestionObject;
}

export interface QuestionObject {
    uuid: string;
    created_at: string;
    answers: string[];
    question: string;
    deleted: boolean;
}

interface QuestionPostBody {
    question_list_uuid: string;
    question: string;
    answers: string[];
}

interface QuestionPostResponse extends ResponseBase {
    question_uuid: string;
}
interface QuestionDeleteBody {
    question_list_uuid: string;
    question_uuid: string;
}

interface QuestionEditBody extends QuestionPostBody {
    question_uuid: string;
}
interface QuestionEditResponse extends ResponseBase {
    new_question_uuid: string;
}
