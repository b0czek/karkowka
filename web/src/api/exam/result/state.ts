import { ApiProvider, ResponseBase } from "../../provider";

export class ExamResultState extends ApiProvider {
    protected static path = "/exam/result/state";

    public static get = async (body: ExamResultStateGetBody): Promise<ExamResultStateGetResponse> => super._fetch("get", body);
}

export interface ExamResultStateGetBody {
    user_uuid: string;
    exam_uuid: string;
}

export interface ExamResultStateGetResponse extends ResponseBase {
    joined: boolean;
    finished: boolean;
}
