# Polygon Miden Tutorial #1

*Using the Miden Client in Rust & TypeScript to Create Accounts, Deploying Faucets, Mint Assets, Consume Notes, and Send Assets*

In this tutorial, we're going to explore how to get started with the Polygon Miden client in both Rust and TypeScript, walking through everything from creating accounts to minting custom assets and sending notes (UTXOs). By the end of this tutorial, you'll have a basic understanding of how to build a basic privacy-focused application in Rust and a web-based wallet on Miden.

## What We'll Cover
* Understanding the difference between public vs. private accounts & notes
* Creating new accounts (public or private)
* Minting custom fungible tokens (assets)
* Sending tokens to other users
* Consuming notes

*If you want to skip straight to the action and run the code, take a look at the code in the `/rust-client/create_mint_consume.rs` or the frontend example in the `/web-client/` directory.*

## Public vs. Private Accounts & Notes
Before we dive into the coding side of things, let's clarify the concepts of public vs. private Notes and Accounts on Miden:

* Public Accounts: The account's data and code are stored on-chain and are openly visible, including its assets.
* Private Accounts: The account's state and logic are off-chain, only known to its owner.
* Public Notes: The note's state is visible to anyone - perfect for scenarios where transparency is desired.
* Private Notes: The note's state is stored off-chain, you will need to share the note data with the relevant parties (via email or Telegram) for them to be able to consume.

*It is useful to think of notes on Miden as "cryptographic cashier's checks" that allow users to send tokens. If the note is private, the note transfer is only known to the sender and receiver.*

## Overview

In this tutorial we will create a miden account for Alice, deploying a custom fungible faucet, minting tokens from the faucet, and then sending the tokens from Alice's account to other Miden accounts. You can follow along with the tutorial by taking a look at `/rust-client/create_mint_consume.rs`.  

## Setup

To follow along with the tutorial using Rust or TypeScript, you'll need to connect to a running Miden node. There are two ways of doing this. By default, the examples connect to the Miden testnet node, however, if you want to run the node locally, follow the instructions in `docs/miden_node_setup_tutorial.md`

## Step 1: Initializing the Client

The main parameters when instantiating the miden-client are the rpc endpoint and the transaction prover. The full example of instantiating the client is in the `rust-client/src/common.rs` file. 

This is how to instantiate the client in Rust & TypeScript:

<details>
<summary>Rust</summary>

```rust
let client = Client::new(
    rpc_client,
    rng_for_client,
    arc_store,
    Arc::new(authenticator),
    Arc::new(tx_prover),
    true,
);
```

</details>

<details>

<summary>TypeScript</summary>

```TypeScript
const nodeEndpoint = 'http://18.203.155.106:57291';
let webClient = webClient.create_client(nodeEndpoint)
```

</details>

## Step 2: Creating a Wallet

To create a wallet using the miden client, we specify the account type that we would like to create by specifying if the account has mutable or immutable code and whether the account is public or private.


<details>
<summary>Rust</summary>

```rust
let alice_template = AccountTemplate::BasicWallet {
    mutable_code: true,
    storage_mode: AccountStorageMode::Public,
};

let (alice_account, _alice_seed) = client.new_account(alice_template).await?;
```

</details>


<details>
<summary>TypeScript</summary>

```TypeScript
const accountId = await webClient.new_wallet(
  AccountStorageMode.public(), // storage type
  true                         // mutable
);
```

</details>


## Step 3: Deploying a Fungible Faucet

A "faucet" account on Miden, mints fungible tokens (similar to ERC-20 tokens). We'll create a public faucet with a token symbol, decimals, and a max supply. We will use this faucet to mint tokens to Alice's account. 


<details>
<summary>Rust</summary>

```rust
let faucet_template = AccountTemplate::FungibleFaucet {
    token_symbol: TokenSymbol::new("MID").unwrap(),
    decimals: 8,
    max_supply: 1_000_000,
    storage_mode: AccountStorageMode::Public,
};

let (faucet_account, _faucet_seed) = client.new_account(faucet_template).await?;
```

</details>


<details>
<summary>TypeScript</summary>

```rust
const faucetId = await webClient.new_faucet(
AccountStorageMode.public(),
false,
'MID',            // Token symbol
8,                // Decimals
BigInt(1_000_000) // max supply
);
```

</details>

*When tokens are minted from this faucet, each token batch is represented as a "note" (UTXO). You can think of a Miden Note as a cryptographic cashier's check that has certain spend conditions attached to it.*

## Step 4: Minting Tokens from the Faucet

To mint notes with tokens from the faucet we created, Alice needs to call the faucet with a `mint_fungible_asset` transaction request. 


<details>
<summary>Rust</summary>

```rust
let amount: i32 = 100;
let fungible_asset = FungibleAsset::new(faucet_account.id(), amount)
    .unwrap();

let transaction_request = TransactionRequest::mint_fungible_asset(
    fungible_asset.clone(),
    alice_account.id(),
    NoteType::Public,
    client.rng(),
)
.unwrap();

let tx_execution_result = client
    .new_transaction(faucet_account.id(), transaction_request)
    .await?;

client.submit_transaction(tx_execution_result).await?;
```

</details>

<details>
<summary>TypeScript</summary>

```TypeScript
const newTxnResult = await webClient.new_mint_transaction(
  _walletId,          // target wallet id
  _faucetId,          // faucet id
  NoteType.public(),  // Note Type
  amount              // amount
);
```

</details>

## Step 5: Consuming Notes

Once Alice has minted a note from the faucet, she will eventually want to spend the tokens that she received in the note created by the mint transaction. To identify notes that are ready to consume, the miden-client has useful function `get_consumable_notes`. It is also important to sync the state of the client before calling the `get_consumable_notes` function. 

*Tip: If you know how many notes to expect after a transaction, use a loop condition to check how many notes of the type you expect are available for consumption instead of using a default timeout to allow the client to detect the notes. This ensures your application isn't idle for longer than what is necessary.*

#### Identifying which notes are available:
<details>
<summary>Rust</summary>

```rust
let consumable_notes = client.get_consumable_notes(Some(alice_account.id())).await?;
```

</details>


<details>
<summary>TypeScript</summary>

```TypeScript
let notes = await webClient.get_consumable_notes(_accountId);
```

</details>

#### Consuming multiple notes in a single transaction:

<details>
<summary>Rust</summary>

```Rust
let transaction_request = TransactionRequest::consume_notes(list_of_note_ids);
let tx_execution_result = client
    .new_transaction(alice_account.id(), transaction_request)
    .await?;

client.submit_transaction(tx_execution_result).await?;
```

</details>


<details>
<summary>TypeScript</summary>

```TypeScript
const consumeTransactionResult = await webClient.new_consume_transaction(
  _targetAccountId,
  [noteId]
);
```

</details>


## Step 6: Sending Tokens to Other Accounts
The standard asset transfer note on Miden is the P2ID note (Pay to Id). In our example, Alice will now send 50 tokens to 5 different accounts.


