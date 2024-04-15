exports.config = {
    directConnect: true,
    baseUrl: 'http://localhost:4200/',
    specs: ['./tests/*.js'],
    framework: 'jasmine',
    useAllAngular2AppRoots: true,
    capabilities: {
        browserName: 'chrome',
    chromeOptions: {
        args: ['--headless', '--disable-gpu']
    }
      }
};