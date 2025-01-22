import {
	FireblocksSDK,
	TransactionArguments,
	TransferPeerPath,
	DestinationTransferPeerPath,
	PeerType,
} from "fireblocks-sdk";
import { readFileSync } from "fs";

const path =
	"/Users/rotemtal/Desktop/testing_api_js/RawSigningPlayground/fireblocks_secret.key";
const apiKey = "a6351f92-07a3-4b45-9b65-04468fdc7aba";
const baseUrl = "https://api.fireblocks.io";
const fireblocks = new FireblocksSDK(
	readFileSync(path, "utf-8"),
	apiKey,
	baseUrl
);

interface getInputSelection {
	input: {
		txHash: String;
		index: Number;
	};
	address: String;
	amount: String;
	confirmations: Number;
	status: String;
}

interface inputToSpend {
	txHash: String;
	index: Number;
}

const source: TransferPeerPath = {
	type: PeerType.VAULT_ACCOUNT,
	id: "2",
};

const destination: DestinationTransferPeerPath = {
	type: PeerType.VAULT_ACCOUNT,
	id: "2",
};

const transactionArguments: TransactionArguments = {
	assetId: "BTC_TEST",
	source: source,
	destination: destination,
	extraParameters: {
		inputsToSpend: {},
	},
};

async function considlateUtxo(inputs: inputToSpend[]): Promise<void> {
	const transaction = fireblocks.createTransaction(transactionArguments);
}
