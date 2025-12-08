import "@/infra/di/register";
import { DataSource } from "typeorm";
import { container } from "tsyringe";
import request from "supertest";
import { DATA_SOURCE_TOKEN, TEST_AGENT_TOKEN } from "@/infra/di/tokens";
import { createApp } from "@/infra/express";

export function register(dataSource: DataSource) {
    container.registerInstance(DATA_SOURCE_TOKEN, dataSource);
    container.registerInstance(TEST_AGENT_TOKEN, request(createApp()));
}
