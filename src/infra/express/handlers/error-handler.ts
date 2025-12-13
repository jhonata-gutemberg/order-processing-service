import express from "express";
import { IllegalArgumentException } from "@/domain/shared/models/exceptions";
import { CustomerAlreadyExistsException } from "@/domain/customers/models/exceptions";

export function errorHandler(
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) {
    if (error instanceof IllegalArgumentException) {
        res.status(400).send({
            message: error.message,
        });
    }
    if (error instanceof CustomerAlreadyExistsException) {
        res.status(409).send({
            message: error.message,
        });
    }
    res.status(500).send({
        message: error.message,
    });
}
