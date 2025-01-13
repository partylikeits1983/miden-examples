# Miden Node Setup Tutorial

There are two ways of connecting to the Miden node. The quickest way is to connect to the miden-testnet. The other way is to connect to spin up the Miden node locally.

## Miden Testnet Node Endpoint

This is the Miden testnet node endpoint:
```
http://18.203.155.106:57291
```

If you want to run your tests completely locally, you can run the miden node locally by executing the following commands:

Installing the Miden node: 
```bash
cargo install miden-node --locked --features testing
```

cd into the `miden-tutorials` directory and run the following commands:
```bash
miden-node make-genesis \
  --inputs-path  node/config/genesis.toml \
  --output-path node/storage/genesis.dat

cd node/storage
miden-node start \
  --config node/config/miden-node.toml \
  node
```

*If you need to reset the local state of the node:*
```bash 
rm -rf rust-client/store.sqlite3 
rm -rf node/storage/accounts
rm -rf node/storage/blocks
```

To specify which miden node you are using, you can specify the miden node endpoint in the `miden-client.toml` file.
