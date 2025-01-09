// src/components/MintTokensSection.tsx
import { useState } from 'react';

interface MintTokensSectionProps {
  isMintingTokens: boolean;
  noteId: string | null;
  disableButtons: boolean;
  handleMintTokens: (walletId: string, amount: bigint) => void;
}

export function MintTokensSection({
  isMintingTokens,
  noteId,
  disableButtons,
  handleMintTokens,
}: MintTokensSectionProps) {
  const [walletIdInput, setWalletIdInput] = useState('');
  const [amountInput, setAmountInput] = useState('');

  const onMint = () => {
    if (!walletIdInput || !amountInput) return;
    const amountBigInt = BigInt(amountInput);
    handleMintTokens(walletIdInput, amountBigInt);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h2>Mint Tokens</h2>
      <input
        type="text"
        placeholder="Target Wallet ID"
        value={walletIdInput}
        onChange={(e) => setWalletIdInput(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amountInput}
        onChange={(e) => setAmountInput(e.target.value)}
      />
      <button
        onClick={onMint}
        disabled={
          disableButtons || isMintingTokens || !walletIdInput || !amountInput
        }
        className="button"
      >
        {isMintingTokens ? 'Loading...' : 'Mint Tokens'}
      </button>
      {noteId && <p>Tokens minted with Note ID: {noteId}</p>}
    </div>
  );
}