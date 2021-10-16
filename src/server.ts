import { Configuration, Inject } from '@tsed/di';
import { PlatformApplication } from '@tsed/common';
import '@tsed/passport';
import '@tsed/platform-express';
import bodyParser from 'body-parser';
// eslint-disable-next-line unicorn/prefer-node-protocol
import path from 'path';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import favicon from 'express-favicon';
import cors from 'cors';
import '@tsed/ajv';
import '@tsed/swagger';
import { OpenSpec3 } from '@tsed/openspec';
import { config, rootDir } from './config';
import IndexCtrl from './controllers/pages/index-controller';
import LoginProtocol from './protocols/login-protocol';

const specOS3: Partial<OpenSpec3> = {
  info: {
    title: 'Portfolio API',
    version: '1.0.0',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

@Configuration({
  ...config,
  acceptMimes: ['application/json'],
  httpPort: process.env.PORT || process.env.HTTP_PORT,
  httpsPort: process.env.HTTPS_PORT,
  mount: {
    '/rest': [`${rootDir}/controllers/**/*.ts`],
    '/': [IndexCtrl],
  },
  componentsScan: [
    `${rootDir}/protocols/*.ts`, // scan protocols directory
  ],
  passport: {},
  logger: {
    requestFields: [
      'reqId',
      'method',
      'url',
      'headers',
      'body',
      'query',
      'params',
      'duration',
    ],
  },
  swagger: [
    {
      path: '/v3/docs',
      specVersion: '3.0.1',
      spec: specOS3,
    },
  ],
  statics: {
    '/': [
      {
        root: `${rootDir}/static`,
        hook: '$beforeRoutesInit',
      },
    ],
  },
  views: {
    root: `${rootDir}/../views`,
    viewEngine: 'ejs',
  },
  exclude: ['**/*.spec.ts'],
  imports: [LoginProtocol],
})
export default class Server {
  @Inject()
  private _app!: PlatformApplication;

  @Configuration()
  settings!: Configuration;

  $beforeRoutesInit(): void {
    this._app
      // eslint-disable-next-line unicorn/prefer-module
      .use(favicon(path.join(__dirname, '/public/favicon.ico')))
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true,
        }),
      );
  }
}
