import { createDefaultPreset } from 'ts-jest';

const defaultPreset = createDefaultPreset();

/** @type {import('jest').Config} */
export default {
  ...defaultPreset,
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"], 
  transform: {
    // Specifically configure ts-jest to keep ESM for .ts files
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  // Allow Jest to find the files regardless of the .js or .ts extension in the import string
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.(js|ts)$': '$1',
  },
};