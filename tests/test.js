var Testyle = require('../testyle.js');

Testyle({
    'prefix': 'tests/'
});

Testyle({
    'require': './tests/lib/index.styl',
    'prefix': './tests/lib/**/',
    'postfix': 'tests/'
});
