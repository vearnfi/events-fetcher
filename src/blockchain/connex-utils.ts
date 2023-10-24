import type {Framework} from "@vechain/connex-framework";
// import bn from "bignumber.js";
// import type {BigNumber} from "bignumber.js";
// import {Transaction} from "thor-devkit";
import type {Address, AbiItem /*, Balance */} from "../typings/types";
// import * as paramsArtifact from "../abis/Params.json";

export type Contract = {
  methods: {
    constant: Record<string, (...args: any[]) =>
      Promise<Record<string | number, any>>>,
    signed: Record<string, (...args: any[]) =>
      Promise<Connex.Vendor.TxResponse>>,
    clause: Record<string, (...args: any[]) => Connex.VM.Clause>;
  }
  events: Record<string, Connex.Thor.Account.Event>
}

/**
 * Utility functions built around the connex library.
 * @todo Create an npm package so that we can reuse this logic
 * in both client and server.
 */
export class ConnexUtils {
  /**
   * Creates ConnexUtils instance given a connex connection.
   */
  constructor(private readonly connex: Framework) {}

  /**
   * Implements constant method.
   * @param {Address} address Smart contract address.
   * @param {AbiItem} method ABI method.
   * @return {*} Method
   */
  private defineConstant(
    address: Address,
    method: AbiItem,
  ): (...args: any[]) => Promise<Record<string | number, any>> {
    return async (...args: any[]) => {
      const res =
        await this.connex.thor.account(address).method(method).call(...args);
      return res.decoded;
    };
  }

  /**
   * Implements signed method.
   * @param {Address} address Smart contract address.
   * @param {AbiItem} method ABI method.
   * @return {*} Method
   */
  private defineSignedRequest(
    address: Address,
    method: AbiItem,
  ): (...args: any[]) => Promise<Connex.Vendor.TxResponse> {
    return async (...args: any[]) => {
      const clause = this.connex.thor
        .account(address)
        .method(method)
        .asClause(...args);

      return this.connex.vendor.sign("tx", [clause]).request();
    };
  }

  /**
   * Defines method clause.
   * @param {Address} address Smart contract address.
   * @param {AbiItem} method ABI method.
   * @return {*} Method
   */
  defineClause(
    address: Address,
    method: AbiItem,
  ): (...args: any[]) => Connex.VM.Clause {
    return (...args: any[]) => {
      return this.connex.thor
        .account(address)
        .method(method)
        .asClause(...args);
    };
  }

  /**
   * Creates an interface to interact with a smart contract methods
   * deployed at the given address.
   * @param {AbiItem[]} abi Smart contract's ABI.
   * @param {Address} address Smart contract's address.
   * @return {Contract} Contract object.
   */
  getContract(abi: AbiItem[], address: Address): Contract {
    const contract: Contract = {
      methods: {constant: {}, signed: {}, clause: {}},
      events: {},
    };

    for (const item of abi) {
      if (item.name != null && item.type === "function") {
        if (item.stateMutability === "view") {
          contract.methods.constant[item.name] =
            this.defineConstant(address, item);
        } else {
          contract.methods.signed[item.name] =
            this.defineSignedRequest(address, item);
          contract.methods.clause[item.name] = this.defineClause(address, item);
        }
      } else if (item.name != null && item.type === "event") {
        contract.events[item.name] =
          this.connex.thor.account(address).event(item);
      }
    }
    return contract;
  }

  /**
   * Requests a signature for a transaction made of a given set of clauses.
   * @param {Connex.VM.Clause[]} clauses Clauses array.
   * @return {Promise<Connex.Vendor.TxResponse>} Transaction response.
   */
  async signTx(
    clauses: Connex.VM.Clause[],
  ): Promise<Connex.Vendor.TxResponse> {
    return this.connex.vendor.sign("tx", clauses).request();
  }

  /**
   * Waits for the transaction to be confirmed.
   * @param {string} txId Transaction ID.
   * @param {number} iterations Maximum number of blocks to wait for
   * transaction confirmation before throwing.
   * @return {Promise<Connex.Thor.Transaction.Receipt>} Transaction receipt.
   * @throws When transaction not found or reverted.
   */
  async waitForReceipt(
    txId: string,
    iterations = 5,
  ): Promise<Connex.Thor.Transaction.Receipt> {
    const ticker = this.connex.thor.ticker();

    for (let i = 0; ; i++) {
      if (i >= iterations) {
        throw new Error("Transaction not found.");
      }

      await ticker.next();

      const receipt = await this.connex.thor.transaction(txId).getReceipt();

      if (receipt?.reverted) {
        throw new Error("The transaction has been reverted.");
      }

      if (receipt) {
        return receipt;
      }
    }
  }

  /**
   * Return current block.
   * @return {Promise<Connex.Thor.Block>} Current block.
   */
  async getCurrentBlock(): Promise<Connex.Thor.Block> {
    const currentBlock = await this.connex.thor.block().get();

    if (currentBlock == null) {
      throw new Error("currentBlock is undefined");
    }

    return currentBlock;
  }

  /**
   * Return transaction associated to the given transaction id.
   * @param {string} txId Transaction id.
   * @return {Promise<Connex.Thor.Transaction>} Transaction.
   */
  async getTransaction(
    txId: string,
  ): Promise<Connex.Thor.Transaction | null> {
    return this.connex.thor.transaction(txId).get();
  }

  /**
   * Fetch VET and VTHO account balance.
   * @param {Address} account Account to be checked.
   * @return {Balance} VET and VTHO account balance in wei.
   */
  // async fetchBalance(account: Address): Promise<Balance> {
  //   const {balance, energy} = await this.connex.thor.account(account).get();

  //   return {
  //     vet: bn(balance),
  //     vtho: bn(energy),
  //   };
  // }

  /**
   * Fetch the Params VeChain smart contract to ge the current base gas price.
   * @see {@link https://docs.vechain.org/tutorials/Useful-tips-for-building-a-dApp.html#_6-estimate-the-transaction-fee}
   * @return {BigNumber} Base gas price.
   */
  // async fetchBaseGasPrice(): Promise<BigNumber> {
  //   // Create an instance of the VeChain Params contract.
  //   const contract = this.getContract(
  //     paramsArtifact.abi as AbiItem[],
  //     // Params contract address for both main and test nets.
  //     "0x0000000000000000000000000000506172616d73",
  //   );

  //   const decoded = await contract.methods.constant.get(
  //     // 0x000000…696365 is the key of baseGasPrice https://docs.vechain.org/others/miscellaneous.html#key-of-governance-params
  //     "0x000000000000000000000000000000000000626173652d6761732d7072696365",
  //   );

  //   return bn(decoded[0]);
  // }

  /**
   * Estimate units of gas used to execute the given set of clauses. This
   * is a measure of the amount of bytes being written to the blockchain.
   * @notice it is impossible to calculate the VM gas offline, which is
   * why a simulation is required. This involves sending the clause
   * data to a node, and the return will include details about the gas
   * consumed.
   * @param {Connex.VM.Clause} clauses Transaction clauses.
   * @param {Address} signer Transaction signer.
   * @see https://github.com/vechain/connex/blob/c00bfc1abec3572c7d1df722bf8a7dfb14295102/packages/driver/src/driver.ts#L165
   */
  // async vmGas(
  //   clauses: Connex.VM.Clause[],
  //   signer?: Address,
  // ): Promise<number> {
  //   let explainer = this.connex.thor.explain(clauses);

  //   if (signer) {
  //     explainer = explainer.caller(signer);
  //   }

  //   const outputs = await explainer.execute();

  //   return outputs.reduce((gas, output) => gas + output.gasUsed, 0);
  // }

  /**
   * Estimate units of gas used to execute the given set of clauses.
   * The total amount of gas is calculated as follows:
   *
   * g_0 + sum_i^n_clauses (g_{type}^i + g_{data}^i + g_{vm}^i)
   *
   * Where:
   * g_0: is a constant transaction fee 5_000
   * g_{type}^i: equals 16_000 gas for regular transactions and 48_000 gas for
   * contract creation.
   * g_{data}^i: 4*n_z^i + 68*n_{nz}^i. Where n_z^i is the number of bytes equal
   * to zero within the data in the i^{th} clause and n_{nz}^i is the number of
   * bytes not equal to zero.
   * g_{vm}^i: is the gas cost returned by the virtual machine for executing the
   * i^{th} clause.
   * @param {Connex.VM.Clause} clauses Transaction clauses.
   * @param {Address} signer Transaction signer.
   * @see https://github.com/vechain/connex/blob/c00bfc1abec3572c7d1df722bf8a7dfb14295102/packages/driver/src/driver.ts#L165
   */
  // async estimateGas(
  //   clauses: Connex.VM.Clause[],
  //   signer?: Address,
  // ): Promise<number> {
  //   // Calculate cost based on the amount of data being submitted.
  //   const intrinsicGas = Transaction.intrinsicGas(
  //     clauses as Transaction.Clause[],
  //   );

  //   // Calculate cost base on the amount of data being written into storage.
  //   const vmGas = await this.vmGas(clauses, signer);
  //   console.log({intrinsicGas, vmGas});

  //   // Adding some extra gas to make sure the tx goes through.
  //   const leeway = vmGas > 0 ? 16000 : 0;

  //   return intrinsicGas + vmGas + leeway;
  // }

  /**
   * Calculate tx fee given gas usage, baseGasPrice and the gasPriceCoefficient.
   * CasPriceCoefficient in {0, 85, 255}.
   * @param {number} gas Gas used to execute the tx.
   * @param {BigNumber} baseGasPrice Base gas price fetched from the VeChain
   * Params contract in wei.
   * @param {number} gasPriceCoef Gas price coefficient to determine regular,
   * medium or high gas cost.
   * @return {BigNumber} Total transaction gas cost in wei.
   */
  // calcTxFee(
  //   gas: number,
  //   baseGasPrice: BigNumber,
  //   gasPriceCoef: 0 | 85 | 255,
  // ): BigNumber {
  //   return bn(baseGasPrice)
  //     .times(gasPriceCoef)
  //     .idiv(255)
  //     .plus(baseGasPrice)
  //     .times(gas);
  // }
}
