import { join } from 'path';

export default () => ({
  /**
   * @property {string} env - environment
   * - development
   * - test
   * - production
   * @default development
   */
  env: process.env.NODE_ENV || 'development',
  /**
   * @property {number} port
   * @default 3000
   */
  port: parseInt(process.env.PORT, 10) || 3000,
  /**
   * @property {string} appName - app name
   */
  appName: 'Nest',
  /**
   * @property {string} appId - app unique id
   */
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  appId: require('../../package.json').name,
  /**
   * @property {string} baseURL - app base url or domain
   * @default http://localhost:{port}/
   */
  baseURL:
    process.env.BASE_URL ||
    `http://localhost:${parseInt(process.env.PORT, 10) || 3000}/`,
  /**
   * @property {boolean} cdnStatic
   * Serve a static folder inside app, set to false if not required (when using s3 or any other services)
   * @default true
   */
  cdnStatic: true,
  /**
   * @property {string} cdnPath
   * Path to serve static, by default it will use public/ folder
   */
  cdnPath: join(__dirname, '../..', 'public'),
  /**
   * @property {string} cdnServeRoot
   * Prefix to serve static url, when using /cdn as value public files will be available at http://localhost:{port}/cdn/
   * @default cdn/
   */
  cdnServeRoot: '/cdn',
  /**
   * @property {string} cdnURL
   * Serve static url, when using /cdn as value public files will be available at http://localhost:{port}/cdn/
   */
  cdnURL:
    process.env.CDN_URL ||
    (process.env.BASE_URL ||
      `http://localhost:${parseInt(process.env.PORT, 10) || 3000}/`) + 'cdn/',
  /**
   * @property {boolean} useSocketIO
   * Enable Socket IO
   * @default true
   */
  useSocketIO: true,
  /**
   * @property {number} paginationLimit
   * Default pagination limit
   * @default 10
   */
  paginationLimit: 10,
  /**
   * @property {string} sessionSecret
   * Session secret
   */
  sessionSecret: 'secret',
});
