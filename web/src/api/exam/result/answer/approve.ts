import { ApiProvider, ResponseBase } from "../../../provider";

export class ExamResultAnswerApprove extends ApiProvider {
    protected static path = "/exam/result/answer/approve";

    public static post = async (body: ExamResultAnswerApprovePostBody): Promise<ResponseBase> => super._fetch("post", body);
}

export interface ExamResultAnswerApprovePostBody {
    participation_uuid: string;
    answer_uuid: string;
    is_correct: boolean;
}
