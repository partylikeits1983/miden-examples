import { useState } from 'react';
import { createWallet } from './lib/createWallet';
import { setupFaucet } from './lib/createFaucet';
import { mintTokens } from './lib/mintTokens';
import { syncState } from './lib/syncState';
import ClientSingleton from './lib/createClient'; // Import ClientSingleton

import './App.css';

function App() {
  const [walletId, setWalletId] = useState<string | null>(null);
  const [faucetId, setFaucetId] = useState<string | null>(null);
  const [noteId, setNoteId] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<boolean | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isCreatingClient, setIsCreatingClient] = useState<boolean>(false);
  const [clientInitialized, setClientInitialized] = useState<boolean>(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState<boolean>(false);
  const [isSettingUpFaucet, setIsSettingUpFaucet] = useState<boolean>(false);
  const [isMintingTokens, setIsMintingTokens] = useState<boolean>(false);
  const [isSyncingState, setIsSyncingState] = useState<boolean>(false);

  const handleCreateClient = async () => {
    setError(null);
    setIsCreatingClient(true);
    try {
      // Add a small delay to ensure UI updates
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
            isSyncingState
          }
          className="button"
        >
          {isCreatingClient ? 'Loading...' : 'Create Client'}
        </button>
        {clientInitialized && <p>Client has been initialized.</p>}

        {/* Wallet Creation */}
        <button
          onClick={handleCreateWallet}
          disabled={
            isCreatingWallet ||
            isSettingUpFaucet ||
            isMintingTokens ||
            isSyncingState
          }
          className="button"
        >
          {isCreatingWallet ? 'Loading...' : 'Create Wallet'}
        </button>
        {walletId && <p>Wallet created with ID: {walletId}</p>}

        {/* Faucet Setup */}
        <button
          onClick={handleSetupFaucet}
          disabled={
            isSettingUpFaucet ||
            isCreatingWallet ||
            isMintingTokens ||
            isSyncingState
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
            !walletId ||
            !faucetId
          }
          className="button"
        >
          {isMintingTokens ? 'Loading...' : 'Mint Tokens'}
        </button>
        {noteId && <p>Tokens minted with Note ID: {noteId}</p>}

        {/* Sync State */}
        <button
          onClick={handleSyncState}
          disabled={
            isSyncingState ||
            isCreatingWallet ||
            isSettingUpFaucet ||
            isMintingTokens
          }
          className="button"
        >
          {isSyncingState ? 'Loading...' : 'Sync State'}
        </button>
        {syncResult && <p>State sync complete</p>}
      </div>

      {/* Error Display */}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
