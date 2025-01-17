use miden_client::{accounts::AccountId, transactions::TransactionRequest, ClientError};

use rust_client::common::{create_new_account, initialize_client};
use std::fs;
use std::path::Path;

use tokio::time::Duration;

#[tokio::main]
async fn main() -> Result<(), ClientError> {
    let mut client = initialize_client().await?;

    let counter_contract_id_str = "0x18130bca4c6dc308";
    let counter_contract_id = AccountId::from_hex(&counter_contract_id_str).unwrap();

    // --- 1) Grab the procedure #2 hash and prepare it for insertion into the script
    let procedure_hash = "0x2259e69ba0e49a85f80d5ffc348e25a0386a0bbe7dbb58bc45b3f1493a03c725";

    // --- 2) Load MASM script
    let file_path = Path::new("../masm/scripts/counter_script.masm");
    let original_code = fs::read_to_string(file_path).expect("Failed to read the file");

    // --- 3) Replace {increment_count} in the script with the actual call line
    let replaced_code = original_code.replace("{increment_count}", &procedure_hash);
    println!("Final script:\n{}", replaced_code);

    // --- 4) Compile the script (now containing the procedure #2 hash)
    let tx_script = client.compile_tx_script(vec![], &replaced_code).unwrap();

    // --- 5) Execute the transaction
    let tx_increment_request = TransactionRequest::new()
        .with_custom_script(tx_script)
        .unwrap();

    let tx_result = client
        .new_transaction(counter_contract_id, tx_increment_request)
        .await
        .unwrap();

    println!("tx result id: {:?}", tx_result.executed_transaction().id());

    let _ = client.submit_transaction(tx_result).await;

    tokio::time::sleep(Duration::from_secs(3)).await;
    client.sync_state().await.unwrap();

    let (account, _data) = client.get_account(counter_contract_id).await.unwrap();

    println!("storage item 0: {:?}", account.storage().get_item(0));

    Ok(())
}
