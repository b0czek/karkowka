import express, { Request, Response } from "express";
import { checkSchema, Schema } from "express-validator";
import { Database } from "../../../database";
import { ExamAnswer } from "../../../entities/ExamAnswer";
import { ExamParticipation } from "../../../entities/ExamParticipation";
import { Question } from "../../../entities/Question";
import { AppRouter } from "../..";
import { ExpressSession } from "../../expressSession";
import validators, { rejectIfBadRequest } from "../../validators";
import { questionObjectCreate } from "./questions";
import lodash from "lodash";

export const examAnswerObjectCreate = (answer: ExamAnswer) => {
    return {
        uuid: answer.uuid,
        answered_at: answer.anwsered_at,
        answer: answer.anwser,
        is_correct: answer.is_correct,
        question: questionObjectCreate(answer.question),
    };
};

const isAnswerCorrect = (answer: string, answers: string[], options: ExamCheckAnswerOptions) => {
    let answersArr = [...answers];
    if (!options.case_sensitive) {
        answersArr = answersArr.map((answer) => answer.toLowerCase());
        answer = answer.toLowerCase();
    }
    if (options.ignore_diacritics) {
        answersArr = answersArr.map((answer) => lodash.deburr(answer));
        answer = lodash.deburr(answer);
    }

    return answersArr.includes(answer);
};

const isParticipationOpen = (joined_at: Date, duration: number) => {
    let now = new Date().valueOf();
    let max_time = joined_at.valueOf() + duration * 1000;
    return max_time > now;
};

export const examAnswerRouterCreate = () => {
    const router = express.Router();

    router.get(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(examAnswerGetSchema, ["query"]),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: ExamAnswerGetBody = (<any>req.query) as ExamAnswerGetBody;
            try {
                let answer = await Database.orm.em.findOne(ExamAnswer, {
                    uuid: body.answer_uuid,
                    participation: {
                        uuid: body.participation_uuid,
                        participant: req.session.user_uuid,
                    },
                });
                if (!answer) {
                    return AppRouter.badRequest(res, "answer does not exist");
                }
                return res.json({
                    error: false,
                    answer: examAnswerObjectCreate(answer),
                });
            } catch (err) {
                return AppRouter.internalServerError(res);
            }
        }
    );

    router.post(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(examAnswerPostSchema, ["body"]),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: ExamAnswerPostSchema = req.body;

            // check whether the question was already answered
            try {
                let answer = await Database.orm.em.findOne(
                    ExamAnswer,
                    {
                        participation: {
                            uuid: body.participation_uuid,
                            participant: req.session.user_uuid,
                        },
                        question: body.question_uuid,
                    },
                    {
                        fields: ["uuid"],
                    }
                );
                if (answer) {
                    return AppRouter.badRequest(res, "question was already answered");
                }
            } catch (err) {
                return AppRouter.internalServerError(res);
            }
            // check if participation is open
            let participation: ExamParticipation;
            try {
                let p = await Database.orm.em.findOne(
                    ExamParticipation,
                    {
                        participant: req.session.user_uuid,
                        uuid: body.participation_uuid,
                    },
                    {
                        fields: ["joined_at", "exam"],
                    }
                );
                if (!p) {
                    return AppRouter.notFound(res, "participation with such uuid does not exist");
                }
                if (!isParticipationOpen(p.joined_at!, p.exam.duration)) {
                    return AppRouter.forbidden(res, "participation closed");
                }
                participation = p;
            } catch (err) {
                return AppRouter.internalServerError(res);
            }

            // get question
            let question: Question;
            try {
                let q = await Database.orm.em.findOne(
                    Question,
                    {
                        uuid: body.question_uuid,
                        belongs_to: {
                            utilized_in: {
                                participations: {
                                    uuid: body.participation_uuid,
                                    participant: req.session.user_uuid,
                                },
                            },
                        },
                    },
                    {
                        fields: ["answers"],
                    }
                );
                if (!q) {
                    return AppRouter.notFound(res);
                }
                question = q;
            } catch (err) {
                return AppRouter.internalServerError(res);
            }

            let answerCorrect = isAnswerCorrect(body.answer, question.answers, {
                case_sensitive: participation.exam.case_sensitive,
                ignore_diacritics: participation.exam.ignore_diacritics,
            });

            let answer = Database.orm.em.create(ExamAnswer, {
                anwser: body.answer,
                is_correct: answerCorrect,
                participation: body.participation_uuid,
                question: body.question_uuid,
            });
            Database.orm.em.persist(answer);

            if (participation.exam.questions_count === participation.answers.count()) {
                Database.orm.em.assign(participation, {
                    finished_at: answer.anwsered_at,
                });
            }

            try {
                Database.orm.em.flush();
            } catch (err) {
                return AppRouter.internalServerError(res);
            }

            return res.status(201).json({
                error: false,
                is_correct: answerCorrect,
                answer_uuid: answer.uuid,
            });
        }
    );

    return router;
};

const examAnswerGetSchema: Schema = {
    answer_uuid: {
        ...validators.uuid,
        ...validators.existsInDb(ExamAnswer, "uuid"),
    },
    participation_uuid: {
        ...validators.uuid,
        ...validators.existsInDb(ExamParticipation, "uuid"),
    },
};

interface ExamAnswerGetBody {
    answer_uuid: string;
    participation_uuid: string;
}

const examAnswerPostSchema: Schema = {
    question_uuid: {
        ...validators.uuid,
        ...validators.existsInDb(Question, "uuid"),
    },
    participation_uuid: {
        ...validators.uuid,
        ...validators.existsInDb(ExamParticipation, "uuid"),
    },
    answer: validators.string,
};
interface ExamAnswerPostSchema {
    question_uuid: string;
    participation_uuid: string;
    answer: string;
}

interface ExamCheckAnswerOptions {
    case_sensitive: boolean;
    ignore_diacritics: boolean;
}
