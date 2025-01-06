### Wallets, Token Minting, Note Consumption, and Transfers

---

### **Overview**

This tutorial demonstrates how to interact with the Miden VM using the [miden-client](https://crates.io/crates/miden-client). The steps cover creating a wallet, deploying a faucet, minting fungible tokens as notes, consuming the notes, and finally sending tokens to other accounts.

To run the example, follow the steps in the `node` directory README to get the Miden node running locally, then in a new terminal window cd into the `rust-client` directory run the following:
```
cargo run --release --bin create_mint_consume
```

---

### **Steps**

1. **Create a Wallet for Alice**  
   A basic wallet is created for Alice, who will interact with the system.

2. **Deploy a Faucet**  
   A fungible faucet is deployed to mint tokens.

3. **Mint Tokens to Alice**  
   Using the faucet, we mint 5 notes, each containing 100 tokens, to Alice's wallet.

4. **Consume Alice's Notes**  
   Alice consolidates her notes by consuming them in a single transaction.

5. **Send Notes to Other Users**  
   Alice sends 5 notes, each containing 50 tokens, to 5 different accounts.

---

### **Code Walkthrough**

The code is located in **`rust-client/src/bin/create_mint_consume.rs`**.

1. **Create Alice's Wallet**

A basic wallet account for Alice is created.

```rust
let alice_template = AccountTemplate::BasicWallet {
    mutable_code: true,
    storage_mode: AccountStorageMode::Public,
};

let (alice_account, _alice_seed) = client.new_account(alice_template).await?;
println!(
    "Successfully created Alice's wallet. ID: {:?}",
    alice_account.id()
);
```

2. **Deploy a Fungible Faucet**
A fungible faucet account is deployed with a token symbol, decimals, and max supply.

```rust
let token_symbol_str = "BTC";
let decimals = 8;
let max_supply = 21_000_000;

let faucet_template = AccountTemplate::FungibleFaucet {
    token_symbol: TokenSymbol::new(token_symbol_str).expect("Token symbol is invalid"),
    decimals,
    max_supply,
    storage_mode: AccountStorageMode::Public,
};

let (faucet_account, _faucet_seed) = client.new_account(faucet_template).await?;
println!(
    "Successfully created a new faucet. Faucet ID: {:?}",
    faucet_account.id()
);
```

3) **Mint Tokens for Alice**
5 notes, each with 100 tokens, are minted to Alice's wallet.
```rust
for i in 1..=5 {
    let amount = 100;
    let fungible_asset = FungibleAsset::new(faucet_account.id(), amount)
        .expect("Failed to create fungible asset struct.");

    let transaction_request = TransactionRequest::mint_fungible_asset(
        fungible_asset.clone(),
        alice_account.id(),
        NoteType::Public,
        client.rng(),
    )
    .expect("Failed to create mint transaction request.");

    let tx_execution_result = client
        .new_transaction(faucet_account.id(), transaction_request)
        .await?;

    client.submit_transaction(tx_execution_result).await?;
    println!("Minted note #{} of {} tokens for Alice.", i, amount);
}
```

4) **Consume Alice's Notes**
Alice consumes all of her notes to consolidate them.

```rust
let consumable_notes = client
    .get_consumable_notes(Some(alice_account.id()))
    .await?;
let list_of_note_ids: Vec<_> = consumable_notes.iter().map(|(note, _)| note.id()).collect();

let transaction_request = TransactionRequest::consume_notes(list_of_note_ids);
let tx_execution_result = client
    .new_transaction(alice_account.id(), transaction_request)
    .await?;

client.submit_transaction(tx_execution_result).await?;
println!("Successfully consumed all of Alice's notes.");
```

5) Send Notes to Other Accounts
Alice sends 5 notes of 50 tokens each to different users.
```rust
for i in 1..=5 {
    let init_seed = {
        let mut seed = [0u8; 32];
        rand::thread_rng().fill(&mut seed);
        seed[0] = i as u8;
        seed
    };

    let target_account_id =
        AccountId::new_dummy(init_seed, AccountType::RegularAccountUpdatableCode);

    let send_amount = 50;
    let fungible_asset = FungibleAsset::new(faucet_account.id(), send_amount)
        .expect("Failed to create fungible asset for sending.");

    let payment_transaction = PaymentTransactionData::new(
        vec![fungible_asset.into()],
        alice_account.id(),
        target_account_id,
    );

    let transaction_request = TransactionRequest::pay_to_id(
        payment_transaction,
        None,              // recall_height: None
        NoteType::Public,  // note type
        client.rng(),      // rng
    )
    .expect("Failed to create payment transaction request.");

    let tx_execution_result = client
        .new_transaction(alice_account.id(), transaction_request)
        .await?;

    client.submit_transaction(tx_execution_result).await?;
    println!(
        "Sent note #{} of {} tokens to AccountId {}.",
        i, send_amount, target_account_id
    );
}
```

