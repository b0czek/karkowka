import { ApiProvider, ResponseBase } from "../provider";

export class Exams extends ApiProvider {
    protected static path = "/exam";

    public static get = async (): Promise<ExamsGetResponse> => this._fetch("get", {});
}

interface ExamsGetResponse extends ResponseBase {
    exams: string[];
}
