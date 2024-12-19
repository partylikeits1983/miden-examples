// src/lib/createWallet.ts

import ClientSingleton from './createClient';
import { AccountStorageMode, AccountHeader } from '@demox-labs/miden-sdk';

export async function createWallet(): Promise<string> {
  try {
    const webClient = await ClientSingleton.getInstance();
    await webClient.create_client();

    const accountId = await webClient.new_wallet(
      AccountStorageMode.public(),
      true
    );

    const accounts: AccountHeader[] = await webClient.get_accounts();
    console.log('length:', accounts.length);

    return accountId.id().to_string();
  } catch (error) {
    console.error('Error setting up wallet:', error);
    throw error;
  }
}
