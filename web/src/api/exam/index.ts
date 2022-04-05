import { ApiProvider, ResponseBase } from "../provider";

export class Exam extends ApiProvider {
    protected static path = "/exam";

    public static get = async (exam_uuid: string): Promise<ExamGetResponse> => this._fetch("get", { exam_uuid });

    public static create = async (body: ExamCreateBody): Promise<ExamCreateResponse> => this._fetch("post", body);

    public static delete = async (exam_uuid: string): Promise<ResponseBase> => this._fetch("delete", { exam_uuid });
}

interface ExamGetResponse extends ResponseBase {
    exam: ExamObject;
}
export interface ExamObject {
    uuid: string;
    name: string;
    created_at: string;
    started_at: string;
    time_to_join: number;
    duration: number;
    questions_count: number;
    question_list: string;
    questions: string[];
    participants: string[];
}

interface ExamCreateBody {
    name: string;
    time_to_join: number;
    started_at: string;
    duration: number;
    questions_count: number;
    question_list_uuid: string;
    participants: string[];
}

interface ExamCreateResponse extends ResponseBase {
    exam_uuid: string;
}
