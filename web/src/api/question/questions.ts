import { QuestionObject } from ".";
import { ApiProvider, ResponseBase } from "../provider";

export class Questions extends ApiProvider {
    protected static path = "/question/questions";

    public static get = async (question_list_uuid: string): Promise<QuestionsGetResponse> =>
        super._fetch("get", { question_list_uuid });

    public static create = async (body: QuestionPostBody): Promise<QuestionPostResponse> => super._fetch("post", body);
}

interface QuestionsGetResponse extends ResponseBase {
    questions: QuestionObject[];
}

interface QuestionBody {
    question: string;
    answers: string[];
}

interface QuestionPostBody {
    question_list_uuid: string;
    questions: QuestionBody[];
}

interface QuestionPostResponse extends ResponseBase {
    questions_uuids: string[];
}
