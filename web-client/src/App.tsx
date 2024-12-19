// src/App.tsx

import { useState } from 'react';
import { createWallet } from './lib/createWallet';
import { setupFaucet } from './lib/createFaucet';
import { mintTokens } from './lib/mintTokens';

import './App.css';

function App() {
  const [walletId, setWalletId] = useState<string | null>(null);
  const [faucetId, setFaucetId] = useState<string | null>(null);
  const [noteId, setNoteId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isCreatingWallet, setIsCreatingWallet] = useState<boolean>(false);
  const [isSettingUpFaucet, setIsSettingUpFaucet] = useState<boolean>(false);
  const [isMintingTokens, setIsMintingTokens] = useState<boolean>(false);

  const handleCreateWallet = async () => {
    setError(null);
    setWalletId(null); // Reset the wallet ID before starting
    setIsCreatingWallet(true);
    try {
      // Add a small delay to ensure UI updates
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
    setFaucetId(null); // Reset the faucet ID before starting
    setIsSettingUpFaucet(true);
    try {
      // Add a small delay to ensure UI updates
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
    setNoteId(null); // Reset the note ID before starting
    setIsMintingTokens(true);
    try {
      // Add a small delay to ensure UI updates
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

  return (
    <div className="container">
      <h1>Miden SDK Demo</h1>
      <div className="content">
        {/* Wallet Creation */}
        <button
          onClick={handleCreateWallet}
          disabled={isCreatingWallet || isSettingUpFaucet || isMintingTokens}
          className="button"
        >
          {isCreatingWallet ? 'Loading...' : 'Create Wallet'}
        </button>
        {walletId && <p>Wallet created with ID: {walletId}</p>}

        {/* Faucet Setup */}
        <button
          onClick={handleSetupFaucet}
          disabled={isSettingUpFaucet || isCreatingWallet || isMintingTokens}
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
            !walletId ||
            !faucetId
          }
          className="button"
        >
          {isMintingTokens ? 'Loading...' : 'Mint Tokens'}
        </button>
        {noteId && <p>Tokens minted with Note ID: {noteId}</p>}
      </div>

      {/* Error Display */}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
