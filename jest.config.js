module.exports = {
    transformIgnorePatterns: [
        '/node_modules/(?!bson)/' // Ignore all node_modules except the bson package
    ],
    globals: {
        'ts-jest': {
            useESM: true, // Use ECMAScript modules
        },
    },
};
