import express from "express";
import { IllegalArgumentException } from "@/domain/shared/models/exceptions";
import {
    CustomerAlreadyExistsException,
    CustomerNotFoundException,
} from "@/domain/customers/models/exceptions";

export function errorHandler(
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) {
    if (error instanceof IllegalArgumentException) {
        return res.status(400).send({
            message: error.message,
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
    return res.status(500).send({
        message: error.message,
    });
}
