import { QuestionListObject } from ".";
import { ApiProvider, ResponseBase } from "../../provider";

export class QuestionLists extends ApiProvider {
    protected static path = "/question/list/lists";

    public static get = async (): Promise<QuestionListsResponse> => super._fetch("get", {});
}

interface QuestionListsResponse extends ResponseBase {
    question_lists: QuestionListObject[];
}
