/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useDecorators } from '@tsed/core';
import { Authenticate, AuthorizeOptions } from '@tsed/passport';
import { In, Returns, Security } from '@tsed/schema';
import { Unauthorized } from '@tsed/exceptions';

const bearerAuth = (options: AuthorizeOptions = {}) => {
  return useDecorators(
    Authenticate('jwt', options),
    Security('bearerAuth'),
    Returns(401, Unauthorized).Description('Unauthorized'),
    In('header')
      .Name('Authorization')
      .Description('Bearer Token')
      .Type(String)
      .Required(false),
  );
};

export default bearerAuth;
