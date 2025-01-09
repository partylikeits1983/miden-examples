import { WalletDetails } from '../lib/getWalletDetails';

interface WalletsTableProps {
  wallets: WalletDetails[];
}

export function WalletsTableSection({ wallets }: WalletsTableProps) {
  if (wallets.length === 0) {
    return <p>No wallets created yet.</p>;
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>All Wallets</h2>
      <table>
        <thead>
          <tr>
            <th>Account ID</th>
            <th>Nonce</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {wallets.map((wallet) => (
            <tr key={wallet.accountId}>
              <td>{wallet.accountId}</td>
              <td>{wallet.nonce}</td>
              <td>{wallet.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
