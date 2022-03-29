import { Request, Response, NextFunction } from "express";
import { ParamSchema, validationResult } from "express-validator";
import { AppRouter } from ".";

const uuid: ParamSchema = {
    trim: true,
    isUUID: {
        bail: true,
        options: 4,
    },
};

const string: ParamSchema = {
    trim: true,
    isString: {
        bail: true,
    },
    notEmpty: true,
};

const password: ParamSchema = {
    ...string,
    isLength: {
        options: {
            max: 128,
            min: 8,
        },
    },
};

export default {
    uuid,
    string,
    password,
};

export const rejectIfBadRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let error = errors.array({ onlyFirstError: true }).pop()!;

        return AppRouter.badRequest(res, `${error.msg} ${error.param}`);
    }
    return next();
};
