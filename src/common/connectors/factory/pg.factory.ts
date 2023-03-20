import {
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { ConfigModule, ConfigService } from "@nestjs/config";

export class PgClient extends Pool {
  logger = new Logger(PgClient.name);
  client: PoolClient;

  async init() {
    this.client = await this.connect();
  }

  async rows<T = unknown>(query, params?, fn = 'PgClient.rows'): Promise<T[]> {
    const queryResult = await this.query<T>(query, params).catch((e) => {
      this.logger.error(
        { fn, status: 'error', errorObjectName: 'query', e },
        JSON.stringify(query, null, 4),
      );
      throw new NotFoundException(
        { fn, status: 'error', errorObjectName: 'query', e, query, params },
        'PgClient.rows error',
      );
    });

    if (queryResult?.rows) {
      return queryResult.rows ?? [];
    } else {
      throw new NotFoundException(
        { fn, status: 'error', errorObjectName: 'query', query, params },
        'PgClient.rows error',
      );
    }
  }

  async row<T = unknown>(query, params?, fnName = null): Promise<T | null> {
    const fn = fnName ? fnName : 'PgClient.row';

    const queryResult = await this.query<T>(query, params).catch((e) => {
      this.logger.error(
        { fn, status: 'error', errorObjectName: 'query', e },
        JSON.stringify(query, null, 4),
      );
      throw new NotFoundException(
        { fn, status: 'error', errorObjectName: 'query', e, query, params },
        'PgClient.row error',
      );
    });

    if (queryResult?.rows) {
      return queryResult.rows[0] ?? null;
    } else {
      throw new NotFoundException(
        { fn, status: 'error', errorObjectName: 'query', query, params },
        'PgClient.row error',
      );
    }
  }

  async close() {
    await this.client.release();
    await this.end();
  }

  async fnValue<T = unknown>(query: string): Promise<T | null> {
    const rowItem = await this.row(`select ${query} as field`);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return rowItem['field'];
  }

  async fieldValue<T = unknown>(
    query: string,
    field: string,
    params?,
    fnName = null,
  ): Promise<T | null> {
    const row = await this.row<T>(query, params, fnName);
    return row?.[field] || null;
  }
}

export const PG_CONNECTOR_FACTORY = {
  provide: PgClient,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<PgClient> => {
    const connectionString = configService.get<string>('DATABASE_URL');
    if (!connectionString) {
      throw new Error(
        'Environment variable DATABASE_URL is required, but not defined',
      );
    }

    const pgClient = new PgClient({ connectionString });
    await pgClient.init();

    const dbUrl = new URL(connectionString);
    Logger.verbose(
      `PG Connected at ${dbUrl.host}${dbUrl.pathname}`,
      'PG_CONNECTOR',
    );

    return pgClient;
  },
};
