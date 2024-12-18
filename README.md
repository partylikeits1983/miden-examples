# miden-tutorials
Miden tutorials for a smooth onboarding

This repository is divided into two parts: 1) the rust-client 2) the web-client directory. 

The rust-client directory has examples of how to interact with the Miden rollup 



### Setup
1)  Install Miden Node:
```
cargo install miden-node --locked --features testing
```

2) Run the node:
```
miden-node make-genesis \
  --inputs-path  node/config/genesis.toml \
  --output-path node/storage/genesis.dat

cd node/storage
miden-node start \
--config node/config/miden-node.toml \
node
```

3) In new terminal window:
```
cargo run --release --bin create_mint_consume 
```

### Reset Miden Node:
```
rm -rf rust-client/store.sqlite3 
rm -rf node/storage/accounts
rm -rf node/storage/blocks
```
