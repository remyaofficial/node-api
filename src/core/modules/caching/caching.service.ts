import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache, CachingConfig } from 'cache-manager';

@Injectable()
export class CachingService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async addToBlackList({ sessionId, expireAt, key }): Promise<void> {
    const keylist = await this.getList({ key: 'keylist' });
    if (keylist && Array.isArray(keylist) && keylist.indexOf(key) > -1) {
      let blacklist = await this.getList({ key });
      if (Array.isArray(blacklist)) blacklist.push(sessionId);
      else blacklist = [sessionId];
      await this.addToList({ key, value: blacklist, expireAt: expireAt });
    } else {
      await this.addToList({ key, value: [sessionId], expireAt: expireAt });
      await this.addToList({ key: 'keylist', value: [key] });
    }
  }

  async isBlackListed({ sessionId }): Promise<boolean> {
    const keylist = await this.getList({ key: 'keylist' });
    if (!keylist || !Array.isArray(keylist) || keylist.length == 0)
      return false;
    for (const key of keylist) {
      const blacklist = await this.getList({ key });
      if (
        blacklist &&
        Array.isArray(blacklist) &&
        blacklist.indexOf(sessionId) > -1
      )
        return true;
    }
    return false;
  }

  async addToList({ key, value, expireAt = null }): Promise<void> {
    const option: CachingConfig = {
      ttl: expireAt,
    };
    await this.cache.set(key, value, option);
  }

  async getList({ key }): Promise<any> {
    return await this.cache.get(key);
  }

  async clearCache(): Promise<void> {
    await this.cache.reset();
  }
}
