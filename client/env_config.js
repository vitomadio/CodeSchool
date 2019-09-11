import config from './config';
const env = process.env.NODE_ENV || 'development';

const configs = {
  development: {
    api: config.url
  },
  production: {
    api: config.url, 
  },
}[env];

export default configs;
