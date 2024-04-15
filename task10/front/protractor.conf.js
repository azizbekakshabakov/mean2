exports.config = {
    directConnect: true,
    baseUrl: 'http://localhost:4200/',
    specs: ['./tests/*.js'],
    framework: 'jasmine',
    useAllAngular2AppRoots: true,
    // capabilities: {
    //     browserName: 'firefox',
    //     'moz:firefoxOptions': {
    //       binary: 'firefox' // Optional: Specify the path to Firefox binary
    //     }
    //   }
    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['--headless', '--disable-gpu']
        }
      },
    
      // Spec patterns are relative to the current working directory when
      // protractor is called
    //   specs: ['path/to/specs/*.spec.js'],
    
      // Framework to use
      framework: 'jasmine',
    
      // Options to be passed to Jasmine
      jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
      }
};