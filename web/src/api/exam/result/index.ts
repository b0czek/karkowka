import { ApiProvider, ResponseBase } from "../../provider";
import { ExamParticipationObject } from "../participation";

export class ExamResult extends ApiProvider {
    protected static path = "/exam/result";

    public static get = async (body: ExamResultGetBody): Promise<ExamResultGetResponse> => super._fetch("get", body);
}

export interface ExamResultGetBody {
    user_uuid: string;
    exam_uuid: string;
}

interface ExamResultGetResponse extends ResponseBase {
    result: ExamParticipationObject;
}
