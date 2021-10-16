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
  swagger!: SwaggerSettings[];

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
