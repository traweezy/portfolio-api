import {
  Constant,
  Controller,
  Get,
  HeaderParams,
  View,
  ProviderScope,
  Scope,
} from '@tsed/common';
import { Hidden, SwaggerSettings } from '@tsed/swagger';
import { Returns } from '@tsed/schema';
import { OpenSpec3 } from '@tsed/openspec';

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

export interface IndexCtrlResponse {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  BASE_URL: string;
  docs: SwaggerSettings[];
}

@Hidden()
@Scope(ProviderScope.SINGLETON)
@Controller('/')
export default class IndexCtrl {
  @Constant('swagger')
  swagger: SwaggerSettings[] = [
    {
      path: '/v3/docs',
      specVersion: '3.0.1',
      spec: specOS3,
    },
  ];

  @Get('/')
  @View('index.ejs')
  @(Returns(200, String).ContentType('text/html'))
  get(
    @HeaderParams('x-forwarded-proto') protocol: string,
    @HeaderParams('host') host: string,
  ): IndexCtrlResponse {
    const hostUrl = `${protocol || 'http'}://${host}`;

    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      BASE_URL: hostUrl,
      docs: this.swagger?.map(conf => {
        return {
          url: hostUrl + conf.path,
          ...conf,
        };
      }),
    };
  }
}
