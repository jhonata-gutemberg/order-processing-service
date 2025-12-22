import express from "express";
import { ValidationError } from "class-validator";
import { ZodError } from "zod";
import {
    CustomerAlreadyExistsException,
    CustomerNotFoundException,
} from "@/domain/customers/models/exceptions";
import { ProductNotFoundException } from "@/domain/products/models/exceptions";

export function errorHandler(
    error: unknown,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) {
    if (error instanceof Array && error[0] instanceof ValidationError) {
        return res.status(400).send(error);
    }
    if (error instanceof ZodError) {
        return res.status(400).send({
            message: JSON.parse(error.message),
        });
    }
    if (
        error instanceof CustomerNotFoundException ||
        error instanceof ProductNotFoundException
    ) {
        return res.status(404).send({
            message: error.message,
        });
    }
    if (error instanceof CustomerAlreadyExistsException) {
        return res.status(409).send({
            message: error.message,
        });
    }
    return res.status(500).send(error);
}
