exports.config = {
    directConnect: true,
    baseUrl: 'http://localhost:4200/',
    specs: ['./tests/*.js'],
    framework: 'jasmine',
    useAllAngular2AppRoots: true,
    capabilities: {
        browserName: 'firefox',
        'moz:firefoxOptions': {
          binary: 'firefox' // Optional: Specify the path to Firefox binary
        }
      }
};