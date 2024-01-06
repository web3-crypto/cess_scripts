import axios, { AxiosError, AxiosResponse } from 'axios';
import { cryptoWaitReady } from "@polkadot/util-crypto";
import * as readlineSync from 'readline-sync';
import _ from 'lodash';
import { createAccountFromSeedPhrase, sleep } from "./helper";
const qs = require('qs');


async function invite(address: string) {
    // Define the data to be sent in the POST request
    const inviteAccount = await createAccountFromSeedPhrase()
    let data = qs.stringify({
        'inviteAccount': `${address}`,
        'inviteesAccount': `${inviteAccount.address}`
    });
    // Make a POST request using Axios
    const response = await axios.post("https://cess.cloud/backstage/front/invite/save", data, {
        headers: {
            'authority': 'cess.cloud',
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/x-www-form-urlencoded',
            'origin': 'https://cess.cloud',
            'referer': 'https://cess.cloud/cobuilder.html?from=cXfrimD2NwprkWXYVrVZoLdF4szeNBHXhXcf7nxc5ryygz9W2',
            'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-requested-with': 'XMLHttpRequest'
        }
    })
    console.log(`Invited: ${inviteAccount.address} ${JSON.stringify(response.data)}`)
}

async function main() {
    console.log(`-----Invite SCRIPTS-----.`)
    await cryptoWaitReady();
    const address = readlineSync.question("Owner Address: ");
    const total = readlineSync.question("Invite total: ");
    for (let index = 0; index < Number(total); index++) {
        console.log(`Invite index ${index + 1}`)
        await invite(address)
        await sleep(_.random(2000, 5000))
    }
}

main()
    .catch(console.error)
    .finally(() => process.exit());