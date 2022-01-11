"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
async function seed(knex) {
    const tableName = 'master_experience_level';
    await knex(tableName).del();
    await knex(tableName).insert([
        {
            type: 'Beginner',
        },
        {
            type: 'Intermediate',
        },
        {
            type: 'Advanced',
        },
        {
            type: 'Expert',
        },
    ]);
}
exports.seed = seed;
//# sourceMappingURL=master_experience_level.js.map