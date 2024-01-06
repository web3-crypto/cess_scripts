import { cryptoWaitReady } from "@polkadot/util-crypto";
import { createAccountFromSeedPhrase } from "../helper";

async function main() {
    await cryptoWaitReady();
    console.log(`Random Address ${createAccountFromSeedPhrase().address}`)

}
main()
    .catch(console.error)
    .finally(() => process.exit());