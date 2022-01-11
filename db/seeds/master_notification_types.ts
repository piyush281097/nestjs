import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  const tableName = 'master_notification_types';
  // Deletes ALL existing entries
  await knex(tableName).del();

  // Inserts seed entries
  await knex(tableName).insert([
    //   Likes
    {
      type: 'post_like',
      message: 'liked your post', //  Jack liked your post: "Hi everyone I would..."
    },
    {
      type: 'trade_like',
      message: 'liked your trade', //  Jack liked your trade: "Bought $TSLA..."
    },
    {
      type: 'comment_like',
      message: 'liked your comment', //  Jack liked your comment: "Nice"
    },
    {
      type: 'reply_like',
      message: 'liked your reply', //  Jack liked your reply: "Great!"
    },

    // Comment
    {
      type: 'post_comment',
      message: 'commented on your post', //  Jack commented on your post: "Nice"
    },
    {
      type: 'trade_comment',
      message: 'commented on your trade', //  Jack commented on your trade: "Looks good!"
    },

    //  Shared - Post.
    {
      type: 'post_shared',
      message: 'shared your post', //  Jack shared your post: "Take a look"
    },

    // Tagged you - Post
    {
      type: 'post_user_tagged',
      message: 'tagged you in a post', //  Jack tagged on their post: "Nice"
    },

    // Following you
    {
      type: 'follow',
      message: 'started following you', //  Jack started following you
    },
  ]);
}
