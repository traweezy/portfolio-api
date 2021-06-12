import { $log } from '@tsed/common';
import { PlatformExpress } from '@tsed/platform-express';
import Server from './server';

const bootstrap = async () => {
  try {
    $log.debug('Start server...');
    const platform = await PlatformExpress.bootstrap(Server);

    await platform.listen();
    $log.debug('Server initialized');
  } catch (error) {
    $log.error(error);
  }
};

bootstrap();

process.on('SIGTERM', () => process.exit());
