import { AsyncLocalStorage } from 'async_hooks';

const asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

export class TenantContext {
  static run(tenantId: string, callback: () => void) {
    const store = new Map<string, any>();
    store.set('tenantId', tenantId);
    asyncLocalStorage.run(store, callback);
  }

  static getTenantId() {
    const store = asyncLocalStorage.getStore();
    return store?.get('tenantId');
  }
}
