module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '\\.(ttf|png|jpg|jpeg)$': '<rootDir>/__mocks__/fileMock.js',
    '^@react-native-community/netinfo$': '<rootDir>/__mocks__/netinfoMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((@react-navigation|react-native|@react-native|@react-native-async-storage|@react-native-vector-icons|react-native-screens)/))',
  ],
};
