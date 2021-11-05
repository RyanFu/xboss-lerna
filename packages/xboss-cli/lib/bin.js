#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const _1 = require(".");
const program = new commander_1.Command();
program.version(`@vant/cli ${_1.cliVersion}`);
program.command('dev').description('Run webpack dev server').action(_1.dev);
program.command('lint').description('Run eslint and stylelint').action(_1.lint);
program
    .command('test')
    .description('Run unit tests through jest')
    .option('--watch', 'Watch files for changes and rerun tests related to changed files')
    .option('--clearCache', 'Clears the configured Jest cache directory and then exits')
    .option('--changedSince <changedSince>', 'Runs tests related to the changes since the provided branch or commit hash')
    .option('--logHeapUsage', 'Logs the heap usage after every test. Useful to debug memory leaks')
    .option('--runInBand', 'Run all tests serially in the current process, rather than creating a worker pool of child processes that run tests')
    .option('--debug', 'Print debugging info about your Jest config')
    .action(_1.test);
program.command('clean').description('Clean all dist files').action(_1.clean);
program
    .command('build')
    .description('Compile components in production mode')
    .option('--watch', 'Watch file change')
    .action(_1.build);
program
    .command('release')
    .description('Compile components and release it')
    .option('--tag <tag>', 'Release tag')
    .action(_1.release);
program
    .command('build-site')
    .description('Compile site in production mode')
    .action(_1.buildSite);
program
    .command('changelog')
    .description('Generate changelog')
    .action(_1.changelog);
program
    .command('commit-lint <gitParams>')
    .description('Lint commit message')
    .action(_1.commitLint);
program.parse();
