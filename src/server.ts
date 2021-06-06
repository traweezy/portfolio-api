import { Configuration, Inject } from '@tsed/di';
import { PlatformApplication } from '@tsed/common';
import '@tsed/platform-express';
import bodyParser from 'body-parser';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import cors from 'cors';
import '@tsed/ajv';
import '@tsed/swagger';
import { config, rootDir } from './config';
import IndexCtrl from './controllers/pages/index-controller';

@Configuration({
  ...config,
  acceptMimes: ['application/json'],
  httpPort: process.env.HTTP_PORT || 8083,
  httpsPort: process.env.HTTPS_PORT,
  mount: {
    '/rest': [`${rootDir}/controllers/**/*.ts`],
    '/': [IndexCtrl],
  },
  swagger: [
    {
      path: '/v3/docs',
      specVersion: '3.0.1',
    },
  ],
  views: {
    root: `${rootDir}/../views`,
    viewEngine: 'ejs',
  },
  exclude: ['**/*.spec.ts'],
})
export default class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  $beforeRoutesInit(): void {
    this.app
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
