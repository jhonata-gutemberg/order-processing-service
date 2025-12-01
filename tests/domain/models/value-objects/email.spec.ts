import { describe, expect, it } from "vitest";
import { Email } from "@domain/models/value-objects";
import { IllegalArgumentException } from "@domain/models/exceptions";

describe("Email", () => {
    it("should be able to create an email with .", () => {
        const validEmail = "john.doe@email.com";

        const email = Email.from(validEmail);

        expect(email).toBeInstanceOf(Email);
        expect(email.toString()).toBe(validEmail);
    });

    it("should be able to create an email with _", () => {
        const validEmail = "john_doe@email.com";

        const email = Email.from(validEmail);

        expect(email).toBeInstanceOf(Email);
        expect(email.toString()).toBe(validEmail);
    });

    it("should be able to create an email with -", () => {
        const validEmail = "john-doe@email.com";

        const email = Email.from(validEmail);

        expect(email).toBeInstanceOf(Email);
        expect(email.toString()).toBe(validEmail);
    });

    it("should be able to create an email if domain has at least two characters", () => {
        const validEmail = "john-doe@email.br";

        const email = Email.from(validEmail);

        expect(email).toBeInstanceOf(Email);
        expect(email.toString()).toBe(validEmail);
    });

    it("should be able to create an email with numbers", () => {
        const validEmail = "john123.doe123@email.com";

        const email = Email.from(validEmail);

        expect(email).toBeInstanceOf(Email);
        expect(email.toString()).toBe(validEmail);
    });

    it("should be able to create an email with subdomain", () => {
        const validEmail = "john.doe@email.com.br";

        const email = Email.from(validEmail);

        expect(email).toBeInstanceOf(Email);
        expect(email.toString()).toBe(validEmail);
    });

    it("should not be able to create an email without @", () => {
        const invalidEmail = "john";

        const email = () => Email.from(invalidEmail);

        expect(email).throws(IllegalArgumentException, "invalid email address");
    });

    it("should not be able to create an email with more than one @", () => {
        const invalidEmail = "john.doe@@email.com";

        const email = () => Email.from(invalidEmail);

        expect(email).throws(IllegalArgumentException, "invalid email address");
    });

    it("should not be able to create an email without domain", () => {
        const invalidEmail = "john.doe@email.";

        const email = () => Email.from(invalidEmail);

        expect(email).throws(IllegalArgumentException, "invalid email address");
    });

    it("should not be able to create an email if domain has less than two characters", () => {
        const invalidEmail = "john.doe@email.b";

        const email = () => Email.from(invalidEmail);

        expect(email).throws(IllegalArgumentException, "invalid email address");
    });

    it("should not be able to create an email if it starts with a special character", () => {
        const invalidEmail = ".johndoe@email.com";

        const email = () => Email.from(invalidEmail);

        expect(email).throws(IllegalArgumentException, "invalid email address");
    });

    it("should not be able to create an email if it ends with a special character", () => {
        const invalidEmail = "johndoe.@email.com";

        const email = () => Email.from(invalidEmail);

        expect(email).throws(IllegalArgumentException, "invalid email address");
    });

    it("should not be able to create an email ending with .", () => {
        const invalidEmail = "john.doe@email.com.br.";

        const email = () => Email.from(invalidEmail);

        expect(email).throws(IllegalArgumentException, "invalid email address");
    });
});
