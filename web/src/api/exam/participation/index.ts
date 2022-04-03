import { ApiProvider, ResponseBase } from "../../provider";

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

interface ExamParticipationObject {
    uuid: string;
    joined_at: string;
    answers: string[];
    correct_answers_count: number;
    exam: string;
}

interface ExamParticipationCreateResponse extends ResponseBase {
    participation_uuid: string;
}
