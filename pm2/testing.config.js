const path = require('path');

module.exports = {
  apps: [
    {
      name: 'tojj-api',
      script: './index.js',
      cwd: path.resolve(__dirname, '..'),
      interpreter: '/root/.nvm/versions/node/v10.16.0/bin/node',
      watch: true,
      instance_var: 'INSTANCE_ID',
    },
  ],
};