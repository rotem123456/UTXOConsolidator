export interface UTXOInput {
  txHash: string;
  index: number;
}
export interface UTXO {
  input: UTXOInput;
  address: string;
  amount: string;
  confirmations: number;
  status: string;
}
export interface UTXOParams {
  vaultId: string;
  assetId: string;
}
