module.exports = {

   // setupFiles: ["jest-canvas-mock", "./setuptestenv.js"],
    setupFiles: [ "./setuptestenv.js"],
    testEnvironment: 'jsdom',
    transformIgnorePatterns: [
        "node_modules/(?!(@luciad)/)"
    ],
    setupFilesAfterEnv: ['./jest.setup.js'],
    testEnvironmentOptions: { "resources": "usable" }
}
