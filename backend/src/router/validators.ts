import { Request, Response, NextFunction } from "express";
import { ParamSchema, validationResult } from "express-validator";
import { Database } from "../database";
import { AppRouter } from ".";
import { AnyEntity, EntityName, FilterQuery, ObjectQuery } from "@mikro-orm/core";
import { OperatorMap } from "@mikro-orm/core/typings";

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
    isLength: {
        bail: true,
        options: {
            max: 256,
        },
    },
};

const stringLength4To32: ParamSchema = {
    ...string,
    isLength: {
        bail: true,
        options: {
            max: 32,
            min: 4,
        },
    },
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

const date: ParamSchema = {
    isISO8601: {
        bail: true,
        options: {
            strict: true,
            strictSeparator: true,
        },
    },
    customSanitizer: {
        options: (date: string) => new Date(date),
    },
};

const futureDate: ParamSchema = {
    isISO8601: {
        bail: true,
        options: {
            strict: true,
            strictSeparator: true,
        },
    },
    custom: {
        bail: true,
        errorMessage: "date cannot be from the past",
        options: (date: string) => new Date(date).valueOf() > new Date().valueOf(),
    },
    customSanitizer: {
        options: (date: string) => new Date(date),
    },
};

const intGt0: ParamSchema = {
    isInt: {
        bail: true,
        options: {
            gt: 0,
        },
    },
};
const int: ParamSchema = {
    isInt: {
        bail: true,
    },
};

const existsInDb = <T extends AnyEntity<T>>(
    entityName: EntityName<T>,
    field: Exclude<keyof ObjectQuery<T>, keyof OperatorMap<T>>,
    negated?: boolean,
    where?: ObjectQuery<T>
): ParamSchema => {
    return {
        custom: {
            bail: true,
            negated: negated ?? false,
            errorMessage: `field ${negated ? "already exists" : "does not exist"} -`,
            options: async (val) => {
                return new Promise(async (resolve, reject) => {
                    let item = await Database.orm.em.findOne(
                        entityName,
                        where
                            ? {
                                  ...where,
                                  [field]: val,
                              }
                            : {
                                  [field]: val,
                              }
                    );
                    item === null ? reject() : resolve(null);
                });
            },
        },
    };
};

export default {
    uuid,
    string,
    stringLength4To32,
    password,
    date,
    futureDate,
    int,
    intGt0,
    existsInDb,
};

export const rejectIfBadRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let error = errors.array({ onlyFirstError: true }).pop()!;

        return AppRouter.badRequest(res, `${error.msg} ${error.param}`);
    }
    return next();
};
