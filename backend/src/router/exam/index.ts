import express, { Request, Response } from "express";
import { checkSchema, Schema } from "express-validator";
import { AppRouter } from "..";
import { Database } from "../../database";
import { Exam } from "../../entities/Exam";
import { Question } from "../../entities/Question";
import { ExpressSession } from "../expressSession";
import validators, { rejectIfBadRequest } from "../validators";
import lodash from "lodash";
import { examsRouterCreate } from "./exams";
import { examParticipationRouterCreate } from "./participation";
import { User } from "../../entities/User";

export const examObjectCreate = (exam: Exam) => {
    return {
        uuid: exam.uuid,
        name: exam.name,
        created_at: exam.created_at,
        started_at: exam.started_at,
        time_to_join: exam.time_to_join,
        duration: exam.duration,
        questions_count: exam.questions_count,
        question_list: exam.utilized_questions.getItems().map((question) => question.uuid),
        participants: exam.participants.getItems().map((participant) => participant.uuid),
    };
};

export const examRouterCreate = () => {
    const router = express.Router();

    router.use("/exams", examsRouterCreate());
    router.use("/participation", examParticipationRouterCreate());

    router.get(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(examUuidSchema),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: ExamUUIDBody = req.body;
            try {
                let exam = await Database.orm.em.findOne(
                    Exam,
                    {
                        uuid: body.exam_uuid,
                        hosted_by: req.session.user_uuid,
                    },
                    {
                        fields: ["participants.uuid", "utilized_questions.uuid"],
                    }
                );
                if (!exam) {
                    return AppRouter.notFound(res);
                }

                return res.json({
                    error: false,
                    exam: examObjectCreate(exam),
                });
            } catch (err) {
                return AppRouter.internalServerError(res);
            }
        }
    );

    // create exam
    router.post(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(examPostSchema),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: ExamPostBody = req.body;

            // check if questions count is valid
            try {
                let questionsCount = await Database.orm.em.count(Question, {
                    belongs_to: {
                        uuid: body.question_list_uuid,
                        owned_by: req.session.user_uuid,
                    },
                });
                if (questionsCount < body.questions_count) {
                    return AppRouter.badRequest(res, "questions_count must not exceed question list's question count");
                }
            } catch (err) {
                return AppRouter.internalServerError(res);
            }

            // randomly select questions
            let randomQuestionsUuids: string[] = [];
            try {
                let questions = await Database.orm.em.find(
                    Question,
                    {
                        belongs_to: body.question_list_uuid,
                    },
                    {
                        fields: ["uuid"],
                    }
                );
                let randomQuestions = lodash.sampleSize(questions, body.questions_count);
                randomQuestionsUuids = randomQuestions.map((question) => question.uuid);
            } catch (err) {
                return AppRouter.internalServerError(res);
            }

            let exam = Database.orm.em.create(Exam, {
                name: body.name,
                started_at: body.started_at,
                time_to_join: body.time_to_join,
                duration: body.duration,
                questions_count: body.questions_count,
                question_list: body.question_list_uuid,
                hosted_by: req.session.user_uuid!,
                utilized_questions: randomQuestionsUuids,
                participants: body.participants_uuids,
            });
            try {
                await Database.orm.em.persistAndFlush(exam);
                return res.status(201).json({
                    error: false,
                    exam_uuid: exam.uuid,
                });
            } catch (err) {
                return AppRouter.internalServerError(res);
            }
        }
    );

    return router;
};

const examUuidSchema: Schema = {
    exam_uuid: {
        ...validators.string,
        ...validators.existsInDb(Exam, "uuid"),
    },
};
interface ExamUUIDBody {
    exam_uuid: string;
}

const examPostSchema: Schema = {
    name: validators.stringLength4To32,
    time_to_join: validators.intGt0,
    started_at: validators.futureDate,
    duration: validators.intGt0,
    questions_count: validators.intGt0,
    question_list_uuid: validators.uuid,

    participants_uuids: {
        isArray: {
            bail: true,
        },
    },
    "participants_uuids.*": {
        ...validators.string,
        ...validators.existsInDb(User, "uuid"),
    },
};

interface ExamPostBody {
    name: string;
    started_at: Date;
    time_to_join: number;
    duration: number;
    questions_count: number;
    question_list_uuid: string;
    participants_uuids: string[];
}
