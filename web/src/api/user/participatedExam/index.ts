import { ApiProvider, ResponseBase } from "../../provider";

export class UserParticipatedExam extends ApiProvider {
    protected static path = "/user/participated_exam";

    public static get = async (exam_uuid: string): Promise<ParticipatedExamResponse> => super._fetch("get", { exam_uuid });
}

interface ParticipatedExamResponse extends ResponseBase {
    exam: ParticipatedExamObject;
}

export interface ParticipatedExamObject {
    uuid: string;
    name: string;
    created_at: string;
    started_at: string;
    time_to_join: number;
    duration: number;
    questions_count: number;
    case_sensitive: boolean;
    ignore_diacritics: boolean;
    hosted_by: string;
    joined: boolean;
    participation_uuid: string | null;
}
