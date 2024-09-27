import { applyDecorators, Controller } from '@nestjs/common';
import { VersionValue } from '@nestjs/common/interfaces';
import { ApiTags } from '@nestjs/swagger';

export function AdminController(payload: {
  routePrefix: string;
  tagName: string;
  version?: VersionValue;
}): ClassDecorator {
  const { routePrefix, version, tagName } = payload;
  return applyDecorators(
    ApiTags(`${tagName} Admin`),
    Controller({
      path: `v${String(version ?? 1)}/admin/${routePrefix}`,
    }),
  );
}
