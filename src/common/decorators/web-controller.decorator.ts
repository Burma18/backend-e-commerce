import { applyDecorators, Controller } from '@nestjs/common';
import { VersionValue } from '@nestjs/common/interfaces/version-options.interface';
import { ApiTags } from '@nestjs/swagger';

export function WebController(payload: {
  routePrefix: string;
  tagName: string;
  version?: VersionValue;
}): ClassDecorator {
  const { routePrefix, version, tagName } = payload;
  return applyDecorators(
    ApiTags(tagName),
    Controller({
      path: `v${String(version ?? 1)}/${routePrefix}`,
    }),
  );
}
