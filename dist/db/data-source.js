"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSourceOptions = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.dataSourceOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
    logging: false,
    synchronize: false,
    ssl: {
        rejectUnauthorized: false,
    },
};
const dataSource = new typeorm_1.DataSource(exports.dataSourceOptions);
exports.default = dataSource;
//# sourceMappingURL=data-source.js.map