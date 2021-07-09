import {
  AddressBalanceResponse,
  ContractCallTransaction,
  MempoolTransaction,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';

export const hasTokenBalance = (balances?: AddressBalanceResponse) => {
  if (!balances) return false;
  let totalFt = 0;
  let totalNft = 0;
  if (balances?.fungible_tokens) {
    totalFt =
      (balances.fungible_tokens && Object.keys(balances?.fungible_tokens || {}).length) || 0;
  }
  if (balances.non_fungible_tokens) {
    totalNft = Object.keys(balances?.non_fungible_tokens || {}).length;
  }

  return totalFt + totalNft > 0;
};

export const hasStxBalance = (balances?: AddressBalanceResponse) => {
  if (!balances) return false;

  let hasBalance = false;
  if (balances?.stx) {
    const { balance, total_sent, total_received, total_fees_sent, total_miner_rewards_received } =
      balances?.stx;

    const total =
      parseInt(balance) +
      parseInt(total_sent) +
      parseInt(total_received) +
      parseInt(total_fees_sent) +
      parseInt(total_miner_rewards_received);
    if (total > 0) {
      hasBalance = true;
    }
  }

  return hasBalance;
};

export const getStackStartBlockHeight = (transactions?: MempoolTransaction[] | Transaction[]) => {
  if (transactions && transactions.length) {
    const latestStackStxTx = (transactions as any).find(
      (tx: MempoolTransaction | Transaction) =>
        tx.tx_type === 'contract_call' &&
        tx.tx_status === 'success' &&
        tx.contract_call.function_name === 'stack-stx'
    );

    const startBurnHeight =
      latestStackStxTx &&
      (latestStackStxTx as ContractCallTransaction)?.contract_call?.function_args?.find(
        arg => arg?.name === 'start-burn-ht'
      );

    return startBurnHeight?.repr?.replace('u', '');
  }
};
