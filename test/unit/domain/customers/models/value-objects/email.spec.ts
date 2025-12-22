import { describe, expect, it } from "vitest";
import { Email } from "@/domain/shared/models/value-objects";
import { IllegalArgumentException } from "@/domain/shared/models/exceptions";

describe("Email", () => {
    it("should be able to create an email with .", async () => {
        const validEmail = "john.doe@email.com";

        const email = await Email.of(validEmail);

        expect(email).toBeInstanceOf(Email);
        expect(email.toString()).toBe(validEmail);
    });

    it("should be able to create an email with _", async () => {
        const validEmail = "john_doe@email.com";

        const email = await Email.of(validEmail);

        expect(email).toBeInstanceOf(Email);
        expect(email.toString()).toBe(validEmail);
    });

    it("should be able to create an email with -", async () => {
        const validEmail = "john-doe@email.com";

        const email = await Email.of(validEmail);

        expect(email).toBeInstanceOf(Email);
        expect(email.toString()).toBe(validEmail);
    });

    it("should be able to create an email if domain has at least two characters", async () => {
        const validEmail = "john-doe@email.br";

        const email = await Email.of(validEmail);

        expect(email).toBeInstanceOf(Email);
        expect(email.toString()).toBe(validEmail);
    });

    it("should be able to create an email with numbers", async () => {
        const validEmail = "john123.doe123@email.com";

        const email = await Email.of(validEmail);

        expect(email).toBeInstanceOf(Email);
        expect(email.toString()).toBe(validEmail);
    });

    it("should be able to create an email with subdomain", async () => {
        const validEmail = "john.doe@email.com.br";

        const email = await Email.of(validEmail);

        expect(email).toBeInstanceOf(Email);
        expect(email.toString()).toBe(validEmail);
    });

    it("should not be able to create an email without @", async () => {
        const invalidEmail = "john";

        const email = () => Email.of(invalidEmail);

        await expect(email).rejects.toThrow();
    });

    it("should not be able to create an email with more than one @", async () => {
        const invalidEmail = "john.doe@@email.com";

        const email = () => Email.of(invalidEmail);

        await expect(email).rejects.toThrow();
    });

    it("should not be able to create an email without domain", async () => {
        const invalidEmail = "john.doe@email.";

        const email = () => Email.of(invalidEmail);

        await expect(email).rejects.toThrow();
    });

    it("should not be able to create an email if domain has less than two characters", async () => {
        const invalidEmail = "john.doe@email.b";

        const email = () => Email.of(invalidEmail);

        await expect(email).rejects.toThrow();
    });

    it("should not be able to create an email if it starts with a special character", async () => {
        const invalidEmail = ".johndoe@email.com";

        const email = () => Email.of(invalidEmail);

        await expect(email).rejects.toThrow();
    });

    it("should not be able to create an email if it ends with a special character", async () => {
        const invalidEmail = "johndoe.@email.com";

        const email = () => Email.of(invalidEmail);

        await expect(email).rejects.toThrow();
    });

    it("should not be able to create an email ending with .", async () => {
        const invalidEmail = "john.doe@email.com.br.";

        const email = () => Email.of(invalidEmail);

        await expect(email).rejects.toThrow();
    });
});
