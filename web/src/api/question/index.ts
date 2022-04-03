import { ApiProvider, ResponseBase } from "../provider";

export class Question extends ApiProvider {
    protected static path = "/question";

    public static get = async (body: QuestionGetBody): Promise<QuestionGetResponse> => super._fetch("get", body);
    public static create = async (body: QuestionPostBody): Promise<QuestionPostResponse> => super._fetch("post", body);
    public static delete = async (body: QuestionDeleteBody): Promise<ResponseBase> => super._fetch("delete", body);
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
