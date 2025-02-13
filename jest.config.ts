import {JestConfigWithTsJest} from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    testEnvironment: 'jsdom',
    transformIgnorePatterns: [
        'node_modules/(?!.*\\.mjs$|@angular|@jsverse/transloco|flat/.*)',
    ],
    transform: {
        '^.+\\.(ts|js|html|svg)$': [
            'jest-preset-angular',
            {
                tsconfig: '<rootDir>/tsconfig.spec.json',
                stringifyContentPathRegex: '\\.(html|svg)$',
                useESM: true
            },
        ],
    },
    moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
    extensionsToTreatAsEsm: ['.ts', '.mts'],
};

export default jestConfig;
