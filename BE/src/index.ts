import express from "express";
import cors from "cors";
import { FireblocksSDK } from "fireblocks-sdk";
import * as fs from "fs";
import * as path from "path";
import { apiKey } from "./apiKey";

const app = express();
const port = process.env.PORT || 3000;

// Read private key from file
const privateKey = fs.readFileSync(
	path.join(__dirname, "../secrets/fireblocks_secret.key"),
	"utf8"
);
const baseUrl = "https://api.fireblocks.io";

if (!apiKey) {
	console.error("Missing FIREBLOCKS_API_KEY environment variable");
	process.exit(1);
}

const fireblocks = new FireblocksSDK(privateKey, apiKey, baseUrl);

app.use(cors());
app.use(express.json());

app.post("/utxo", async (req, res) => {
	try {
		console.log(req.body);
		const response = await fireblocks.getUnspentInputs(
			req.body.vaultId,
			req.body.assetId
		);
		res.json(response);
	} catch (error) {
		console.error("Error fetching UTXO:", error);
		res.status(500).json({
			error: "Failed to fetch UTXO data",
		});
	}
});

app.get("/utxo", async (req, res) => {
	try {
		const response = await fireblocks.getUnspentInputs("2", "BTC_TEST");
		res.json(response);
	} catch (error) {
		console.error("Error fetching UTXO:", error);
		res.status(500).json({
			error: "Failed to fetch UTXO data,Please check docker BE is running",
		});
	}
});

app.post("/createTransaction", async (req, res) => {
	try {
		console.log("Received UTXOs:", req.body.selectedMappedUtxo);
		res.json({ success: true, message: "Transaction received" });
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ success: false, error });
	}
});

app.get("/", async (req, res) => {
	res.json("BE is running");
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
