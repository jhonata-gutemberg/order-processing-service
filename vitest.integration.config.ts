import { defineConfig } from "vitest/config";
import tsConfigPaths from "vitest-tsconfig-paths";

export default defineConfig({
    plugins: [tsConfigPaths({ projects: ["./tsconfig.test.json"] })],
    test: {
        include: ["test/integration/**/*.spec.ts"],
        setupFiles: ["test/integration/utils/setup.ts"],
    },
});
