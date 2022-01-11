"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
async function seed(knex) {
    const tableName = 'master_notification_types';
    await knex(tableName).del();
    await knex(tableName).insert([
        {
            type: 'post_like',
            message: 'liked your post',
        },
        {
            type: 'trade_like',
            message: 'liked your trade',
        },
        {
            type: 'comment_like',
            message: 'liked your comment',
        },
        {
            type: 'reply_like',
            message: 'liked your reply',
        },
        {
            type: 'post_comment',
            message: 'commented on your post',
        },
        {
            type: 'trade_comment',
            message: 'commented on your trade',
        },
        {
            type: 'post_shared',
            message: 'shared your post',
        },
        {
            type: 'post_user_tagged',
            message: 'tagged you in a post',
        },
        {
            type: 'follow',
            message: 'started following you',
        },
    ]);
}
exports.seed = seed;
//# sourceMappingURL=master_notification_types.js.map