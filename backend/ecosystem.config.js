const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.deploy') });

const USER = process.env.DEPLOY_USER;
const HOST = process.env.HOST;
const REPO = process.env.REPO;
const BRANCH = process.env.BRANCH;
const BACKEND_PATH = process.env.DEPLOY_BACKEND_PATH;
const KEY = process.env.KEY;

module.exports = {
  apps: [
    {
      name: 'app',
      script: 'dist/app.js',
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
      path: BACKEND_PATH,
      key: KEY,
      ssh_options: 'StrictHostKeyChecking=no',
      'pre-deploy-local': `scp -i ${KEY} -o IdentitiesOnly=yes .env.deploy ${USER}@${HOST}:${BACKEND_PATH}/.env`,
      'post-deploy': [
        `scp -i ${KEY} ./dist/ ${USER}@${HOST}:${BACKEND_PATH}/dist/`,
        `scp -i ${KEY} -r package.json package-lock.json ${USER}@${HOST}:${BACKEND_PATH}`,
        `cd ${BACKEND_PATH} && npm ci && npm run build`,
        `pm2 startOrReload ecosystem.config.js --only app --env production`,
      ].join('&&'),
    },
  },
};
