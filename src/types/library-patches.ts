import { Prisma } from '@prisma/client';

export interface PatchedPrismaClientKnownRequestError
  extends Prisma.PrismaClientKnownRequestError {
  meta: { cause: string };
}
