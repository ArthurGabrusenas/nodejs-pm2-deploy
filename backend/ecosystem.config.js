const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.deploy') });

const USER = process.env.USER;
const HOST = process.env.HOST;
const REPO = process.env.REPO;
const BRANCH = process.env.BRANCH;
const PATH = process.env.PATH;
const KEY = process.env.KEY;

module.exports = {
  apps: [
    {
      name: 'app',
      script: 'dist/app.js',
      cwd: PATH,
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    production: {
      user: USER,
      host: HOST,
      ref: BRANCH,
      repo: REPO,
      path: PATH,
      key: KEY,
      'pre-deploy': `scp .env.deploy ${USER}@${HOST}:${PATH}/.env`,
      'post-deploy': [
        `scp -i ${KEY} ./dist/ ${USER}@${HOST}:${PATH}/dist`,
        `scp -i ${KEY} -r package.json package-lock.json ${USER}@${HOST}:${PATH}`,
        `cd ${PATH} && npm ci && npm run build`,
        `pm2 startOrReload ecosystem.config.js --only app --env production`,
      ].join('&&'),
    },
  },
};
