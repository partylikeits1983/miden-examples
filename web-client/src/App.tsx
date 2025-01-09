import { useState } from 'react';
import { createWallet } from './lib/createWallet';
import { setupFaucet } from './lib/createFaucet';
import { mintTokens } from './lib/mintTokens';
import { syncState } from './lib/syncState';
import ClientSingleton from './lib/createClient';
import { clearDatabase } from './lib/clearDB';
import { consumeNotes } from './lib/consumeNotes';
import { getConsumableNotes } from './lib/getConsumableNotes';

import './App.css';

function App() {
  const [walletId, setWalletId] = useState<string | null>(null);
  const [faucetId, setFaucetId] = useState<string | null>(null);
  const [noteId, setNoteId] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Loading/processing states
  const [isCreatingClient, setIsCreatingClient] = useState<boolean>(false);
  const [clientInitialized, setClientInitialized] = useState<boolean>(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState<boolean>(false);
  const [isSettingUpFaucet, setIsSettingUpFaucet] = useState<boolean>(false);
  const [isMintingTokens, setIsMintingTokens] = useState<boolean>(false);
  const [isSyncingState, setIsSyncingState] = useState<boolean>(false);
  const [isClearingDb, setIsClearingDb] = useState<boolean>(false);

  // States for note operations
  const [isConsumingNotes, setIsConsumingNotes] = useState<boolean>(false);
  const [consumedNoteTxId, setConsumedNoteTxId] = useState<string | null>(null);
  const [isGettingNotes, setIsGettingNotes] = useState<boolean>(false);

  /* ------------------------------
   * Handlers
   * ------------------------------ */

  const handleCreateClient = async () => {
    setError(null);
    setIsCreatingClient(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      await ClientSingleton.getInstance();
      setClientInitialized(true);
      console.log('Client Initialized');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error creating client');
    } finally {
      setIsCreatingClient(false);
    }
  };

  const handleCreateWallet = async () => {
    setError(null);
    setWalletId(null);
    setIsCreatingWallet(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const id = await createWallet();
      setWalletId(id);
      console.log('Wallet ID:', id);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error creating wallet');
    } finally {
      setIsCreatingWallet(false);
    }
  };

  const handleSetupFaucet = async () => {
    setError(null);
    setFaucetId(null);
    setIsSettingUpFaucet(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const id = await setupFaucet();
      setFaucetId(id);
      console.log('Faucet ID:', id);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error setting up faucet');
    } finally {
      setIsSettingUpFaucet(false);
    }
  };

  const handleMintTokens = async () => {
    setError(null);
    setNoteId(null);
    setIsMintingTokens(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (!walletId || !faucetId) {
        throw new Error('Wallet ID and Faucet ID are required to mint tokens');
      }
      const id = await mintTokens(walletId, faucetId);
      setNoteId(id);
      console.log('Note ID:', id);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error minting tokens');
    } finally {
      setIsMintingTokens(false);
    }
  };

  const handleGetNotes = async () => {
    setError(null);
    setIsGettingNotes(true);
    try {
      if (!walletId) {
        throw new Error('No wallet to fetch notes from');
      }
      const notes = await getConsumableNotes(walletId);
      if (notes.length === 0) {
        setNoteId(null);
        setError('No notes found for this wallet');
      } else {
        setNoteId(notes[0].noteId);
        console.log('Consumable Notes:', notes);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error fetching consumable notes');
    } finally {
      setIsGettingNotes(false);
    }
  };

  const handleConsumeNotes = async () => {
    setError(null);
    setConsumedNoteTxId(null);

    if (!noteId) {
      setError('No notes to consume');
      return;
    }

    if (!walletId || !faucetId) {
      setError('Wallet ID and Faucet ID are required to consume notes');
      return;
    }

    setIsConsumingNotes(true);
    try {
      const txId = await consumeNotes(walletId, faucetId, noteId);
      setConsumedNoteTxId(txId);
      console.log('Consumed Note TX ID:', txId);

      setNoteId(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error consuming notes');
    } finally {
      setIsConsumingNotes(false);
    }
  };

  const handleSyncState = async () => {
    setError(null);
    setSyncResult(null);
    setIsSyncingState(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const result = await syncState();
      setSyncResult(result);
      console.log('Sync result:', result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error syncing state');
    } finally {
      setIsSyncingState(false);
    }
  };

  const handleClearDatabase = async () => {
    setError(null);
    setIsClearingDb(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      await clearDatabase();
      console.log('Database cleared');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error clearing database');
    } finally {
      setIsClearingDb(false);
    }
  };

  /* ------------------------------
   * Rendering
   * ------------------------------ */
  return (
    <div className="container">
      <h1>Miden SDK Demo</h1>
      <div className="content">
        {/* Create Client */}
        <button
          onClick={handleCreateClient}
          disabled={
            isCreatingClient ||
            isCreatingWallet ||
            isSettingUpFaucet ||
            isMintingTokens ||
            isSyncingState ||
            isClearingDb
          }
          className="button"
        >
          {isCreatingClient ? 'Loading...' : 'Create Client'}
        </button>
        {clientInitialized && <p>Client has been initialized.</p>}

        {/* Create Wallet */}
        <button
          onClick={handleCreateWallet}
          disabled={
            isCreatingWallet ||
            isSettingUpFaucet ||
            isMintingTokens ||
            isSyncingState ||
            isClearingDb
          }
          className="button"
        >
          {isCreatingWallet ? 'Loading...' : 'Create Wallet'}
        </button>
        {walletId && <p>Wallet created with ID: {walletId}</p>}

        {/* Setup Faucet */}
        <button
          onClick={handleSetupFaucet}
          disabled={
            isSettingUpFaucet ||
            isCreatingWallet ||
            isMintingTokens ||
            isSyncingState ||
            isClearingDb
          }
          className="button"
        >
          {isSettingUpFaucet ? 'Loading...' : 'Setup Faucet'}
        </button>
        {faucetId && <p>Faucet created with ID: {faucetId}</p>}

        {/* Mint Tokens */}
        <button
          onClick={handleMintTokens}
          disabled={
            isMintingTokens ||
            isCreatingWallet ||
            isSettingUpFaucet ||
            isSyncingState ||
            isClearingDb ||
            !walletId ||
            !faucetId
          }
          className="button"
        >
          {isMintingTokens ? 'Loading...' : 'Mint Tokens'}
        </button>
        {noteId && <p>Tokens minted with Note ID: {noteId}</p>}

        {/* Get Notes */}
        <button
          onClick={handleGetNotes}
          disabled={isGettingNotes || !walletId}
          className="button"
        >
          {isGettingNotes ? 'Loading...' : 'Get Notes'}
        </button>

        {/* Consume Notes */}
        <button
          onClick={handleConsumeNotes}
          disabled={
            isConsumingNotes ||
            isCreatingWallet ||
            isSettingUpFaucet ||
            isMintingTokens ||
            isSyncingState ||
            isClearingDb ||
            !noteId // <-- Disable if no note is present
          }
          className="button"
        >
          {isConsumingNotes ? 'Consuming...' : 'Consume Notes'}
        </button>

        {!noteId && <p>No notes to consume</p>}
        {consumedNoteTxId && (
          <p>Successfully consumed note. Transaction ID: {consumedNoteTxId}</p>
        )}

        {/* Sync State */}
        <button
          onClick={handleSyncState}
          disabled={
            isSyncingState ||
            isCreatingWallet ||
            isSettingUpFaucet ||
            isMintingTokens ||
            isClearingDb
          }
          className="button"
        >
          {isSyncingState ? 'Loading...' : 'Sync State'}
        </button>
        {syncResult && <p>State sync complete</p>}

        {/* Clear Database */}
        <button
          onClick={handleClearDatabase}
          disabled={
            isClearingDb ||
            isCreatingClient ||
            isCreatingWallet ||
            isSettingUpFaucet ||
            isMintingTokens ||
            isSyncingState
          }
          className="button"
        >
          {isClearingDb ? 'Clearing...' : 'Clear Database'}
        </button>
      </div>

      {/* Error Display */}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
