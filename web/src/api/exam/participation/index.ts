import { ApiProvider, ResponseBase } from "../../provider";
import { AnswerObject } from "./answer";

export class ExamParticipation extends ApiProvider {
    protected static path = "/exam/participation";

    public static get = async (participation_uuid: string): Promise<ExamParticipationGetResponse> =>
        super._fetch("get", { participation_uuid });

    public static create = async (exam_uuid: string): Promise<ExamParticipationCreateResponse> =>
        super._fetch("post", { exam_uuid });
}

interface ExamParticipationGetResponse extends ResponseBase {
    exam_participation: ExamParticipationObject;
}

export interface ExamParticipationObject {
    uuid: string;
    joined_at: string;
    finished_at: string | null;
    answers: AnswerObject[];
    exam: string;
}

interface ExamParticipationCreateResponse extends ResponseBase {
    participation_uuid: string;
}
