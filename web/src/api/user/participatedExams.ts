import { ApiProvider, ResponseBase } from "../provider";

export class UserParticipatedExams extends ApiProvider {
    protected static path = "/user/participated_exams";

    public static get = async (): Promise<ParticipatedExamsResponse> => super._fetch("get", {});
}

interface ParticipatedExamsResponse extends ResponseBase {
    exams: ParticipatedExamObject[];
}
interface ParticipatedExamObject {
    uuid: string;
    joined: boolean;
    participation_uuid: string | null;
}
