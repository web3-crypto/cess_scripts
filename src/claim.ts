import { InitAPI } from "cess-js-sdk";
import axios, { AxiosError, AxiosResponse } from 'axios';
import BN from 'bn.js';
import { cryptoWaitReady } from "@polkadot/util-crypto";
import * as readlineSync from 'readline-sync';
import { KeyringPair } from "@polkadot/keyring/types";
import Keyring from "@polkadot/keyring";
import * as bip39 from 'bip39'
import { ApiPromise } from "@polkadot/api";
import _ from 'lodash';

const apiUrl = 'https://testnet-faucet.cess.cloud/transfer';
const testnetConfig = {
    nodeURL: "wss://testnet-rpc2.cess.cloud/ws/",
    keyringOption: { type: "sr25519", ss58Format: 42 },
    gatewayURL: "http://deoss-pub-gateway.cess.cloud/",
};
const perAmountClaim = 9000
async function main() {
    console.log(`-----TCESS SCRIPTS-----.`)
    const recipient = readlineSync.question("Claim Address: ");
    const claimAmount = readlineSync.question("Amount: ");
    const claimLength = Math.floor(Number(claimAmount) / perAmountClaim) + 1
    console.log("Total Claim Time ", claimLength)
    const { api } = await InitAPI(testnetConfig);
    for (let index = 0; index < claimLength; index++) {
        console.log(`Claim Processing index ${index}`)
        const senderKeyPair = await createAccountFromSeedPhrase()
        await claimTCess(senderKeyPair.address)
        await transferTCess(api, senderKeyPair, recipient, perAmountClaim)
        if (index < claimLength - 1) {
            await sleep(_.random(3000, 10000))
        }
    }
}
async function transferTCess(api: ApiPromise, senderKeyPair: KeyringPair, recipient: string, amount: number) {
    const cTestUnit = amount * 10 ** 12
    // Create a transfer transaction
    const transfer = api.tx.balances.transfer(recipient, new BN(cTestUnit));
    // Sign and send the transaction
    const txHash = await transfer.signAndSend(senderKeyPair);
    console.log(`Claimed ${amount} TCESS -  Transaction hash: ${txHash}`);
}

async function claimTCess(address: string) {
    // Define the data to be sent in the POST request
    const postData = {
        Address: address,
    };

    // Make a POST request using Axios
    await axios.post(apiUrl, postData, {
        headers: {
            'Content-Type': 'application/json'
        },
    })
    // .then((response: AxiosResponse) => {
    //     // Handle successful response
    //     console.log('Response body:', response.data);
    // })
    // .catch((error: AxiosError) => {
    //     // Handle error
    //     console.error('Error:', error.message);
    //     if (error.response) {
    //         // The request was made, but the server responded with a status code outside the 2xx range
    //         console.error('Status code:', error.response.status);
    //         console.error('Response data:', error.response.data);
    //     } else if (error.request) {
    //         // The request was made, but no response was received
    //         console.error('No response received');
    //     } else {
    //         // Something happened in setting up the request that triggered an Error
    //         console.error('Error message:', error.message);
    //     }
    // });
}

async function createAccountFromSeedPhrase(seedPhrase?: string): Promise<KeyringPair> {
    await cryptoWaitReady();
    // Create a keyring instance
    const mnemonic = seedPhrase ? seedPhrase : bip39.generateMnemonic();

    const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });

    // Add an account using the provided seed phrase
    const keyPair = keyring.addFromMnemonic(mnemonic);

    return keyPair;
}


export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

main()
    .catch(console.error)
    .finally(() => process.exit());