module.exports = {
    transformIgnorePatterns: [
        '/node_modules/(?!bson)/' // Ignore all node_modules except the bson package
    ],
    extensionsToTreatAsEsm: ['.js'], // Treat .js files as ECMAScript modules
    globals: {
        'ts-jest': {
            useESM: true, // Use ECMAScript modules
        },
    },
};
