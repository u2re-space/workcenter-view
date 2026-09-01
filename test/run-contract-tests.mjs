/**
 * Bundle Work Center TypeScript contract tests with production aliases, then
 * execute them through Node's native test runner.
 */
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { join, resolve } from "node:path";
import { build } from "vite";

import { getViewResolveAliases } from "../../view-resolve-aliases.js";

const root = resolve(import.meta.dirname, "..");
const outputDirectory = await mkdtemp(
    join(resolve(root, "../../../node_modules"), ".workcenter-contracts-")
);

const testEntries = {
    "workcenter-ingress.test": resolve(root, "test/workcenter-ingress.test.ts"),
    "workcenter-session.test": resolve(root, "test/workcenter-session.test.ts"),
    "workcenter-turn.test": resolve(root, "test/workcenter-turn.test.ts"),
    "workcenter-events.test": resolve(root, "test/workcenter-events.test.ts"),
    "workcenter-ui.test": resolve(root, "test/workcenter-ui.test.ts"),
    "workcenter-commands.test": resolve(root, "test/workcenter-commands.test.ts")
};

const requested = new Set(process.argv.slice(2));
const selectedEntries = Object.fromEntries(
    Object.entries(testEntries).filter(([name]) =>
        requested.size === 0 || requested.has(name.replace(".test", "")) || requested.has(name)
    )
);

if (Object.keys(selectedEntries).length === 0) {
    throw new Error(`Unknown Work Center contract suite: ${[...requested].join(", ")}`);
}

try {
    await build({
        root,
        configFile: false,
        logLevel: "warn",
        resolve: {
            alias: getViewResolveAliases(root)
        },
        build: {
            target: "esnext",
            minify: false,
            sourcemap: "inline",
            outDir: outputDirectory,
            emptyOutDir: true,
            lib: {
                entry: selectedEntries,
                formats: ["es"],
                fileName: (_format, entryName) => `${entryName}.mjs`
            },
            rollupOptions: {
                external: [/^node:/, "jsdom"]
            }
        }
    });

    const outputs = Object.keys(selectedEntries)
        .map((name) => resolve(outputDirectory, `${name}.mjs`));
    const exitCode = await new Promise((resolveExit, rejectRun) => {
        const child = spawn(
            process.execPath,
            [
                `--localstorage-file=${resolve(outputDirectory, "local-storage.json")}`,
                "--test",
                ...outputs
            ],
            {
                cwd: root,
                env: { ...process.env },
                stdio: "inherit"
            }
        );
        child.once("error", rejectRun);
        child.once("exit", (code, signal) => {
            if (signal) rejectRun(new Error(`node --test terminated by ${signal}`));
            else resolveExit(code ?? 1);
        });
    });

    if (exitCode !== 0) process.exitCode = exitCode;
} finally {
    await rm(outputDirectory, { recursive: true, force: true });
}
