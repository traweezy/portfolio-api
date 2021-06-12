import { Injectable, OnInit, OnDestroy } from '@tsed/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export default class PrismaService
  extends PrismaClient
  implements OnInit, OnDestroy
{
  async $onInit(): Promise<void> {
    await this.$connect();
  }

  async $onDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
