import express from "express";
import { ValidationError } from "class-validator";
import { IllegalArgumentException } from "@/domain/shared/models/exceptions";
import {
    CustomerAlreadyExistsException,
    CustomerNotFoundException,
} from "@/domain/customers/models/exceptions";
import { ZodError } from "zod";

export function errorHandler(
    error: unknown,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) {
    if (error instanceof IllegalArgumentException) {
        return res.status(400).send({
            message: error.message,
        });
    }
    if (error instanceof Array && error[0] instanceof ValidationError) {
        return res.status(400).send(error);
    }
    if (error instanceof ZodError) {
        return res.status(400).send({
            message: JSON.parse(error.message),
        });
    }
    if (error instanceof CustomerAlreadyExistsException) {
        return res.status(409).send({
            message: error.message,
        });
    }
    if (error instanceof CustomerNotFoundException) {
        return res.status(404).send({
            message: error.message,
        });
    }
    return res.status(500).send(error);
}
