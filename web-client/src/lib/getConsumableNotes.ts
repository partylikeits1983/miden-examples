// src/lib/getConsumableNotes.ts
import ClientSingleton from './createClient';
import { AccountId } from '@demox-labs/miden-sdk';

interface ConsumableNoteRecord {
  noteId: string;
  consumability: {
    accountId: string;
    consumableAfterBlock: number;
  }[];
}

export async function getConsumableNotes(
  accountId?: string
): Promise<ConsumableNoteRecord[]> {
  const webClient = await ClientSingleton.getInstance();

  console.log('accountID', accountId);

  await webClient.sync_state();

  let records;
  if (accountId) {
    const _accountId = AccountId.from_hex(accountId);
    records = await webClient.get_consumable_notes(_accountId);

    console.log('records', records);
  } else {
    records = await webClient.get_consumable_notes();
  }

  return records.map((record: any) => ({
    noteId: record.input_note_record().id().to_string(),
    consumability: record.note_consumability().map((consumability: any) => ({
      accountId: consumability.account_id().to_string(),
      consumableAfterBlock: consumability.consumable_after_block(),
    })),
  }));
}
