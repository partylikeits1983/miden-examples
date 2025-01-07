// src/lib/createWallet.ts

import ClientSingleton from './createClient';
import { AccountStorageMode, AccountHeader } from '@demox-labs/miden-sdk';

export async function createWallet(): Promise<string> {
  try {
    const webClient = await ClientSingleton.getInstance();

    const accountId = await webClient.new_wallet(
      AccountStorageMode.private(),
      true
    );

    // await webClient.sync_state();

    console.log('account: ', accountId);

    const accounts: AccountHeader[] = await webClient.get_accounts();
    console.log('length:', accounts.length);

    // await webClient.getAccountAuthByPubKey(accountId);

    return accountId.id().to_string();
  } catch (error) {
    console.error('Error setting up wallet:', error);
    throw error;
  }
}
