import ClientSingleton from './createClient';
import { AccountId, NoteType, AccountHeader } from '@demox-labs/miden-sdk';

export async function mintTokens(
  walletId: string,
  faucetId: string
): Promise<string> {
  try {
    const webClient = await ClientSingleton.getInstance();

    const _walletId = AccountId.from_hex(walletId);
    const _faucetId = AccountId.from_hex(faucetId);

    console.log('wallet and faucet', _walletId, _faucetId);
    console.log('hex:', _walletId.to_string(), _faucetId.to_string());

    await webClient.fetch_and_cache_account_auth_by_pub_key(_faucetId);
    await webClient.sync_state();

    // console.log(_walletId.is_faucet(), _faucetId.is_faucet());
    /* 
    const accounts: AccountHeader[] = await webClient.get_accounts();

    console.log('length:', accounts.length);

    if (accounts.length === 0) {
      console.log('No accounts found.');
      throw new Error('No accounts found.');
    } */

    // const lastAccount = accounts[accounts.length - 1].id();

    console.log('calling mint');

    const newTxnResult = await webClient.new_mint_transaction(
      _walletId,
      _faucetId,
      NoteType.private(),
      BigInt(100)
    );

    await webClient.sync_state();

    return newTxnResult.created_notes().notes().toString();
  } catch (error) {
    console.error('Error setting up faucet:', error);
    throw error;
  }
}
