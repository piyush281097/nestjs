declare const _default: {
    development: {
        client: string;
        connection: {
            database: string;
            user: string;
            password: string;
            host: string;
            port: string;
        };
        pool: {
            min: number;
            max: number;
        };
        migrations: {
            directory: string;
        };
        seeds: {
            directory: string;
        };
    };
};
export default _default;
