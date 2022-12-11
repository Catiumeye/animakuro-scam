import Database from 'database';
import { RegisterInput } from 'core/auth/inputs/register.schema';
import {
    CreateSiteAuthSessionInput,
    UpdateSiteAuthSessionInput,
} from 'core/auth/inputs/site-auth-session.schema';
import Redis from '../../../loaders/redis';

export class AuthService {
    private readonly prisma = Database.getInstance().logic;
    private readonly redis = Redis.getInstance().logic;

    async setRegisterConfirmation(code: string, data: RegisterInput) {
        await this.redis
            .set(`confirmation:register:${code}`, JSON.stringify(data), {
                EX: 300,
            })
            .catch(console.error);
    }

    async getRegisterConfirmation(code: string): Promise<RegisterInput | null> {
        const data = await this.redis
            .get(`confirmation:register:${code}`)
            .catch(console.error);

        if (!data) {
            return null;
        }

        return JSON.parse(data);
    }

    async deleteRegisterConfirmation(code: string) {
        await this.redis
            .del(`confirmation:register:${code}`)
            .catch(console.error);
    }

    async createSiteAuthSession({
        userId,
        ...rest
    }: CreateSiteAuthSessionInput) {
        return await this.prisma.siteAuthSession.create({
            data: {
                userId: userId || '0',
                ...rest,
            },
        });
    }

    async updateSiteAuthSession(
        id: string,
        siteAuthSessionInput: UpdateSiteAuthSessionInput,
    ) {
        return await this.prisma.siteAuthSession.update({
            where: {
                id,
            },
            data: siteAuthSessionInput,
        });
    }
}
