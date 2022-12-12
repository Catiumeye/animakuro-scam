import * as dotenv from 'dotenv';

dotenv.config();

export class ConfigParent {
    public get mailConfig() {
        const port = this.get('MAILER_PORT', 465);
        return {
            host: this.get('MAILER_HOST', 'smtp.mail.ru'),
            port,
            secure: port === 465, // true for 465, false for other ports
            auth: {
                user: this.get('MAILER_EMAIL', 'some@mail.ru'), // generated ethereal user
                pass: this.get('MAILER_PASSWORD', 'password'), // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false,
            },
        };
    }

    public get mailFrom() {
        return {
            name: this.get('MAILER_SENDER_NAME', 'somename'),
            address: this.get('MAILER_EMAIL', 'somename@mail.ru'),
        };
    }

    public get redisUrl() {
        return this.get('REDIS_URL', 'redis://localhost:6379');
    }

    public get(propertyPath: string, defaultValue: string): string;
    public get(propertyPath: string, defaultValue: number): number;
    public get(
        propertyPath: string,
        defaultValue: number | string,
    ): number | string {
        const element = process.env[propertyPath];
        if (!element) return defaultValue;
        const currElement = Number(element);
        return isNaN(currElement) ? element : currElement;
    }
}

export default class Config {
    private readonly _config: ConfigParent;
    private static instance: Config;

    private constructor() {
        this._config = new ConfigParent();
    }

    public static getInstance(): Config {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }

    get logic(): ConfigParent {
        return this._config;
    }
}