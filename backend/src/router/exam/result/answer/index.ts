import express, { Request, Response } from "express";
import { answerApproveRouterCreate } from "./approve";

export const answerRouterCreate = () => {
    const router = express.Router();

    router.use("/approve", answerApproveRouterCreate());

    return router;
};
