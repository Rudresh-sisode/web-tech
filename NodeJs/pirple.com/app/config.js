/**
 * Create and export configuration variables
 */

// Container for all the environments
var environments = {};

// Staging (default) environment
environments.staging = {
    'httpPort' : 3000,
    'httpsPort' : 3001,
    'envName' : 'staging',
    'hashingSecret':'thisIsASecret',
    'maxChecks': 5,
    'twilio' : {
        'accountSid':'',
        'authToken':'',
        'fromPhone':''
    }

};

// Production environment
environments.production = {
    'httpPort' : 5000,
    'httpsPort' : 5001,
    'envName' : 'production',
    'hashingSecret':'thisIsASecret',
    'maxChecks': 5,
    'twilio' : {
        'accountSid':'',
        'authToken':'',
        'fromPhone':''
    }

};

// Determine which environment was passed as a command-line argument
let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not, default to staging
let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;