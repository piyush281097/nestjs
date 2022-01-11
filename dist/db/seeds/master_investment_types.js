"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
async function seed(knex) {
    const tableName = 'master_investment_types';
    await knex(tableName).del();
    await knex(tableName).insert([
        {
            type: 'Intraday Trading',
        },
        {
            type: 'Short Term Trading',
        },
        {
            type: 'Short Term Investment',
        },
        {
            type: 'Long Term Investment',
        },
        {
            type: 'Swing Trading',
        },
    ]);
}
exports.seed = seed;
//# sourceMappingURL=master_investment_types.js.map