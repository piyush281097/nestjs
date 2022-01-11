"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
async function seed(knex) {
    const tableName = 'master_interests';
    await knex(tableName).del();
    await knex(tableName).insert([
        {
            type: 'Stocks',
            image_url: 'https://investmates-images.s3.ap-south-1.amazonaws.com/common/interests/stocks.png',
        },
        {
            type: 'Commodity',
            image_url: 'https://investmates-images.s3.ap-south-1.amazonaws.com/common/interests/commodity.png',
        },
        {
            type: 'MF/ETF',
            image_url: 'https://investmates-images.s3.ap-south-1.amazonaws.com/common/interests/mf_etf.png',
        },
        {
            type: 'Real Estate',
            image_url: 'https://investmates-images.s3.ap-south-1.amazonaws.com/common/interests/real_estate.png',
        },
        {
            type: 'Crypto',
            image_url: 'https://investmates-images.s3.ap-south-1.amazonaws.com/common/interests/crypto.png',
        },
        {
            type: 'Future & Options',
            image_url: 'https://investmates-images.s3.ap-south-1.amazonaws.com/common/interests/futures.png',
        },
        {
            type: 'Forex',
            image_url: 'https://investmates-images.s3.ap-south-1.amazonaws.com/common/interests/forex.png',
        },
        {
            type: 'Indices',
            image_url: 'https://investmates-images.s3.ap-south-1.amazonaws.com/common/interests/indices.png',
        },
        {
            type: 'Bonds',
            image_url: 'https://investmates-images.s3.ap-south-1.amazonaws.com/common/interests/bonds.png',
        },
        {
            type: 'Insurance',
            image_url: 'https://investmates-images.s3.ap-south-1.amazonaws.com/common/interests/insurance.png',
        },
        {
            type: 'Bank Deposit',
            image_url: 'https://investmates-images.s3.ap-south-1.amazonaws.com/common/interests/bank.png',
        },
        {
            type: 'Retirement',
            image_url: 'https://investmates-images.s3.ap-south-1.amazonaws.com/common/interests/retirement.png',
        },
    ]);
}
exports.seed = seed;
//# sourceMappingURL=interests.js.map