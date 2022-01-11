"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const fs = require("fs");
const path = require("path");
async function up(knex) {
    const fileNames = [
        'notification_comment_like.sql',
        'notification_follower.sql',
        'notification_post_comment.sql',
        'notification_post_like.sql',
        'notification_post_user_tag.sql',
        'notification_shared_post.sql',
        'notification_trade_comment.sql',
        'notification_trade_like.sql',
    ];
    for (const file of fileNames) {
        const query = fs
            .readFileSync(path.join(__dirname, `../triggers/${file}`))
            .toString();
        await knex.raw(query);
    }
}
exports.up = up;
async function down(knex) {
    await knex.raw('DROP TRIGGER trigger_comment_like_create on comment_likes;');
    await knex.raw('DROP FUNCTION comment_like_create');
    await knex.raw('DROP TRIGGER trigger_comment_like_update on comment_likes;');
    await knex.raw('DROP FUNCTION comment_like_update');
    await knex.raw('DROP TRIGGER trigger_comment_like_delete on comment_likes;');
    await knex.raw('DROP FUNCTION comment_like_delete');
    await knex.raw('DROP TRIGGER trigger_follower_create on followers;');
    await knex.raw('DROP FUNCTION follower_create');
    await knex.raw('DROP TRIGGER trigger_follower_update on followers;');
    await knex.raw('DROP FUNCTION follower_update');
    await knex.raw('DROP TRIGGER trigger_follower_delete on followers;');
    await knex.raw('DROP FUNCTION follower_delete');
    await knex.raw('DROP TRIGGER trigger_post_comment_create on posts_comments;');
    await knex.raw('DROP FUNCTION post_comment_create');
    await knex.raw('DROP TRIGGER trigger_post_comment_update on posts_comments;');
    await knex.raw('DROP FUNCTION post_comment_update');
    await knex.raw('DROP TRIGGER trigger_post_comment_delete on posts_comments;');
    await knex.raw('DROP FUNCTION post_comment_delete');
    await knex.raw('DROP TRIGGER trigger_post_like_create on posts_likes;');
    await knex.raw('DROP FUNCTION post_like_create');
    await knex.raw('DROP TRIGGER trigger_post_like_update on posts_likes;');
    await knex.raw('DROP FUNCTION post_like_update');
    await knex.raw('DROP TRIGGER trigger_post_like_delete on posts_likes;');
    await knex.raw('DROP FUNCTION post_like_delete');
    await knex.raw('DROP TRIGGER trigger_post_user_tagged_create on tagged_users;');
    await knex.raw('DROP FUNCTION post_user_tagged_create');
    await knex.raw('DROP TRIGGER trigger_post_user_tagged_update on tagged_users;');
    await knex.raw('DROP FUNCTION post_user_tagged_update');
    await knex.raw('DROP TRIGGER trigger_post_user_tagged_delete on tagged_users;');
    await knex.raw('DROP FUNCTION post_user_tagged_delete');
    await knex.raw('DROP TRIGGER trigger_post_shared_create on posts_shared;');
    await knex.raw('DROP FUNCTION post_shared_create');
    await knex.raw('DROP TRIGGER trigger_post_shared_update on posts_shared;');
    await knex.raw('DROP FUNCTION post_shared_update');
    await knex.raw('DROP TRIGGER trigger_post_shared_delete on posts_shared;');
    await knex.raw('DROP FUNCTION post_shared_delete');
    await knex.raw('DROP TRIGGER trigger_trade_comment_create on trades_comments;');
    await knex.raw('DROP FUNCTION trade_comment_create');
    await knex.raw('DROP TRIGGER trigger_trade_comment_update on trades_comments;');
    await knex.raw('DROP FUNCTION trade_comment_update');
    await knex.raw('DROP TRIGGER trigger_trade_comment_delete on trades_comments;');
    await knex.raw('DROP FUNCTION trade_comment_delete');
    await knex.raw('DROP TRIGGER trigger_trade_like_create on trades_likes;');
    await knex.raw('DROP FUNCTION trade_like_create');
    await knex.raw('DROP TRIGGER trigger_trade_like_update on trades_likes;');
    await knex.raw('DROP FUNCTION trade_like_update');
    await knex.raw('DROP TRIGGER trigger_trade_like_delete on trades_likes;');
    await knex.raw('DROP FUNCTION trade_like_delete');
}
exports.down = down;
//# sourceMappingURL=20211225052630_add_notifications_trigger.js.map