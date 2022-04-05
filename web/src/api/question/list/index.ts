import { QuestionObject } from "..";
import { ApiProvider, ResponseBase } from "../../provider";

export class QuestionList extends ApiProvider {
    protected static path = "/question/list";

    public static get = async (question_list_uuid: string): Promise<QuestionListResponse> =>
        super._fetch("get", { question_list_uuid });

    public static create = async (body: QuestionListCreateBody): Promise<QuestionListCreateResponse> =>
        super._fetch("post", body);

    public static delete = async (question_list_uuid: string): Promise<ResponseBase> =>
        super._fetch("delete", { question_list_uuid });
}

interface QuestionListResponse extends ResponseBase {
    question_list: QuestionListObject;
}

export interface QuestionListObject {
    uuid: string;
    created_at: string;
    name: string;
    questions?: QuestionObject[];
    questions_count: number;
    deleted: boolean;
}

interface QuestionListCreateBody {
    name: string;
    questions: QuestionBody[];
}
interface QuestionBody {
    question: string;
    answers: string[];
}

interface QuestionListCreateResponse extends ResponseBase {
    question_list_uuid: string;
}
