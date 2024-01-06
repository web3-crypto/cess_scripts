import { KeyringPair } from "@polkadot/keyring/types";
import Keyring from "@polkadot/keyring";
import * as bip39 from 'bip39'
import _ from 'lodash';

export function createAccountFromSeedPhrase(seedPhrase?: string): KeyringPair {
    const mnemonic = seedPhrase ? seedPhrase : bip39.generateMnemonic();
    const keyring = new Keyring();
    const pair = keyring.createFromUri(mnemonic);
    keyring.setSS58Format(11330);
    return pair;
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}