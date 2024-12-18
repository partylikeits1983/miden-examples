# Running the Miden Node locally

### Setup
1)  **Install Miden Node:**
```
cargo install miden-node --locked --features testing
```

2) **In the root of the miden-tutorials directory, run the following:**
```
miden-node make-genesis \
  --inputs-path  node/config/genesis.toml \
  --output-path node/storage/genesis.dat

cd node/storage
miden-node start \
--config node/config/miden-node.toml \
node
```