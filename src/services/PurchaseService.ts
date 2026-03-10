export class PurchaseService {
  static async initialize(): Promise<void> {}

  static async subscribe(sku: string): Promise<boolean> {
    console.log('IAP временно отключён, SKU:', sku);
    return false;
  }

  static async restorePurchases(): Promise<boolean> {
    return false;
  }

  static destroy(): void {}
}
