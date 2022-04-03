import { ApiProvider, ResponseBase } from "../../provider";

export class ExamParticipationQuestions extends ApiProvider {
    protected static path = "/exam/participation/answer";

    public static get = async (participation_uuid: string): Promise<ExamQuestionsResponse> =>
        this._fetch("get", { participation_uuid });
}

interface ExamQuestionsResponse extends ResponseBase {
    questions: ExamQuestionObject[];
}

export interface ExamQuestionObject {
    uuid: string;
    question: string;
}
