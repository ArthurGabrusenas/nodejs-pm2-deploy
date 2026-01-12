const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.deploy') });

const REPO = process.env.REPO;
const BRANCH = process.env.BRANCH;
const FRONTEND_PATH = process.env.DEPLOY_FRONTEND_PATH;
const HOST = process.env.HOST;
const KEY = process.env.KEY;

module.exports = {
  deploy: {
    production: {
      ref: BRANCH,
      repo: REPO,
      host: HOST,
      path: FRONTEND_PATH,
      key: KEY,
      ssh_options: 'StrictHostKeyChecking=no',
      'post-deploy': `cd ${FRONTEND_PATH}/current/frontend && npm ci && npm run build`
    },
  },
};
