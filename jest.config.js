// https://jestjs.io/docs/en/configuration
module.exports = {
  bail: 1,
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/index.js', '<rootDir>/guess.js'],  //  glob pattern, not regex!
  coverageDirectory: 'reports',
  // coveragePathIgnorePatterns: ['<rootDir>/reports', '<rootDir>/test', '\\.[a-z]'],
  transform: {
      '^[^.]+.vue$': 'vue-jest',
      '^.+\\.js$': 'babel-jest'
    },
  verbose: true
}
