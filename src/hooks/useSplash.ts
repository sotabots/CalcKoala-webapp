import { useGetTx, useGetUsers, useGetChat, useGetCurrencies, useGetSummary } from '../api'
import { useStore } from '../store'

export const useSplash = () => {
  const { isLoading: isTxLoading, error: txError, data: tx } = useGetTx()
  const { isLoading: isSummaryLoading, error: summaryError, data: summary } = useGetSummary()

  // todo: improve
  const chatId =
    (!tx ? undefined : tx.chat_id) ||
    (!summary ? undefined : summary.chat_id)

  const { isLoading: isUsersLoading, error: usersError } = useGetUsers(chatId)
  const { isLoading: isChatLoading, error: chatError } = useGetChat(chatId)
  const { isLoading: isCurrenciesLoading, error: currenciesError } = useGetCurrencies(chatId)

  const isLoading = isTxLoading || isUsersLoading || isChatLoading || isCurrenciesLoading || isSummaryLoading

  const { currencies, txPatchError } = useStore()

  const unknownCurrencyError =
    (tx?.currency_id && currencies.length && !currencies.find((currency) => currency._id === tx.currency_id))
      ? new Error(`Unknown tx currency ${tx.currency_id}`)
      : null

  const error = txError || usersError || chatError || txPatchError || currenciesError || unknownCurrencyError || summaryError

  return { isLoading, error }
}
