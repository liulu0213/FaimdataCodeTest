const basicConfig = {
  defaultResultPageSize: 10,
  maxRows: 500,
  deviceMonitorInterval: 120,
};

const pgConfig = {
  client: "pg",
  connection: {
    host: "35.222.33.222",
    user: "monitor",
    password: "a$XMwR503@234y6oMa",
    database: "monitor",
  },
  searchPath: ["knex", "device_monitor"],
};

const knex_config = {
  client: "pg",
  connection: pgConfig.connection,
  searchPath: pgConfig.searchPath,
  pool: { min: 0, max: 7 },
};

const constants = {
  defaultResultPageSize: 10,
  maxRows: 500,
  keyFilename: "config/gcp_key.json",
  projectId: "machine-learning-148914",
  bigQueryColumns: [
    "id",
    "code",
    "craneId",
    "lockTime",
    "unlockTime",
    "lock",
    "unlock",
    "result",
    "update_time",
  ],
  xxbigQueryTableName:
    "machine-learning-148914.containers_data_demo.containers_demo",
  xxdefaultBigQueryTableName:
    "machine-learning-148914.containers_data_demo.containers_demo",
  schemas: "device_monitor",
  columns: [
    "id",
    "code",
    "craneid",
    "lock_time",
    "unlock_time",
    "lock",
    "unlock",
    "lock_block",
    "unlock_block",
    "raw_data",
    "update_time",
  ],
  tableName: "containers_demo",
  defaultTableName: "containers_demo",
};

exports.basicConfig = basicConfig;
exports.knex_config = knex_config;
exports.constants = constants;
