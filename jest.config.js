module.exports = {
    roots: ["<rootDir>/"],
    testMatch: [
        "**/?(*.)+(spec|test).+(ts|tsx|js)",
    ],
    transform: {
        "^.+\\.(js|ts|tsx)$": "ts-jest",
    },
};