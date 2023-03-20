import { PgLiteral } from 'node-pg-migrate';

export const UUID_ID_FIELD = {
  id: {
    type: 'uuid',
    default: new PgLiteral('uuid_generate_v4()'),
    notNull: true,
    primaryKey: true,
  },
};
