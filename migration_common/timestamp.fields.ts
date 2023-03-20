import { PgLiteral } from 'node-pg-migrate';

export const TIMESTAMP_FIELDS = {
  created_at: {
    type: 'timestamptz',
    notNull: true,
    default: new PgLiteral('NOW()'),
  },
  updated_at: {
    type: 'timestamptz',
    notNull: false,
    default: null,
  },
};
