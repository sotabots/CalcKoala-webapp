import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'
import Lottie from 'lottie-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '../kit/Button'
import Header from '../kit/Header'
import Overlay from '../kit/Overlay'
import Panel from '../kit/Panel'
import Screen from '../kit/Screen'
import SummaryItem from '../kit/SummaryItem'
import SummaryItemDetailed from '../kit/SummaryItemDetailed'

import { closeApp } from '../utils'

// import { decimals } from '../const'
// import { useInit } from '../hooks'
import { useStore } from '../store'
import { useCurrencies } from '../hooks'
// import { feedback, EVENT } from '../feedback'
// import { usePatchTransaction } from '../api'
// import { formatAmount } from '../utils'
// import type { TShare } from '../types'

import lottieKoalaSettledUp from '../assets/lottie-koala-settled-up.json'
import lottieKoalaSuccess from '../assets/lottie-koala-success.json'

function Summary() {
  const { t } = useTranslation()
  const [, notificationOccurred] = useHapticFeedback()

  const { summary, setSummary } = useStore()
  const { getCurrencyById } = useCurrencies()

  const [selectedId, setSelectedId] = useState<null | number>(null)
  const isSelected = selectedId !== null
  const selectedSummaryItem = (summary?.items || []).find(summaryItem => summaryItem._id === selectedId)
  const selectedSummaryItemCurrency = selectedSummaryItem ? getCurrencyById(selectedSummaryItem.currency_id) : undefined

  const [isBusy, setIsBusy] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)

  const currencyIds = !summary?.items
    ? []
    : [...(new Set(summary.items.map(item => item.currency_id)))]

  /*
  useInit()
  const { currencies, transaction, setTransaction, setSuccess, setTxPatchError } = useStore()

  const patchTransaction = usePatchTransaction()

  const save = async () => {
    const confirmedTransaction = {
      ...transaction,
      is_confirmed: true
    }
    setIsBusy(true)
    try {
      await feedback(EVENT.SEND_TRANSACTION)
      console.log(JSON.stringify(confirmedTransaction, null, 2))
      const resJson = await patchTransaction(confirmedTransaction)
      console.log('patch res json', resJson)
      setSuccess(true)
      setTimeout(() => {
        window.Telegram?.WebApp.close()
      }, 2300)
    } catch (e) {
      setSuccess(false)
      setTxPatchError(e as Error)
    } finally {
      setIsBusy(false)
    }
  }
  */

  const goDetailedSummary = () => {
    // todo
    window.open('https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit','_blank')
  }

  const settleUp = async () => {
    if (selectedId === null || !summary) {
      return
    }
    setIsBusy(true)
    setTimeout(() => {
      try {
        // todo
        setSummary({
          ...summary,
          items: [...summary.items].filter(item => item._id !== selectedId)
        })
        setIsSuccessOpen(true)
        console.log('success vibro')
        notificationOccurred('success')
        setTimeout(() => {
          setSelectedId(null)
        }, 1000)
        setTimeout(() => {
          setIsSuccessOpen(false)
        }, 2500)
      } catch (e) {
        // todo
      } finally {
        setIsBusy(false)
      }
    }, 500)
  }

  if (!summary) {
    return null
  }

  return (
    <Screen>
      <Header onBack={!isSelected ? closeApp : () => { setSelectedId(null) }} />

      {!(!selectedId && summary?.items && summary.items.length === 0) && (
        <div className="mb-2 px-4 flex items-center justify-between">
          <h2 className="pt-[2px] pb-[6px]">
            {!isSelected ? t('chatBalances') : `${t('settleUpBy')} ${selectedSummaryItemCurrency?.symbol}`}
          </h2>
          {!isSelected && (
            <Button
              theme="text"
              text={t('detailedSummary')}
              onClick={goDetailedSummary}
            />
          )}
        </div>
      )}

      {!isSelected && summary?.items && summary.items.length > 0 && (
        <div className="flex flex-col gap-2">
        {currencyIds.map((currencyId, i) => (
          <Panel key={`Panel-${i}`}>
            <h3>{t('summaryBy')} {getCurrencyById(currencyId)?.symbol || currencyId}</h3>
            <div className="mt-4 flex flex-col gap-4">
              {summary.items.filter(item => item.currency_id === currencyId).map((summaryItem, j) => (
                <SummaryItem
                  key={`SummaryItem-${i}-${j}`}
                  {...summaryItem}
                  onClick={() => { setSelectedId(summaryItem._id) }}
                />
              ))}
            </div>
          </Panel>
        ))}
        </div>
      )}

      {!selectedId && summary?.items && summary.items.length === 0 && (
        <div className="w-[244px] mx-auto flex flex-col gap-6 pt-8 text-center">
          <div className="mx-auto w-[215px] h-[200px]">
            <Lottie
              style={{ width: 215, height: 200 }}
              animationData={lottieKoalaSettledUp}
              loop={true}
            />
          </div>
          <div className="text-[24px] leading-[32px] font-semibold">
            {t('allSettledUp')}
          </div>
          <Button
            theme="text"
            text={t('detailedSummary')}
            onClick={goDetailedSummary}
          />
        </div>
      )}

      {selectedId && selectedSummaryItem && (
        <Panel>
          <SummaryItemDetailed {...selectedSummaryItem} />
        </Panel>
      )}

      <Button
        isBottom
        text={!selectedId ? t('close') : t('settleUp')}
        onClick={!selectedId ? closeApp : settleUp}
        isBusy={isBusy}
      />

      <Overlay isOpen={isSuccessOpen}>
        <div className="w-[280px] mx-auto flex flex-col gap-4 pt-8 text-center">
          <div className="mx-auto w-[286px] h-[237px]">
            <Lottie
              style={{ width: 286, height: 237 }}
              animationData={lottieKoalaSuccess}
              loop={true}
            />
          </div>
          <div className="text-[24px] leading-[32px] font-semibold">
            {t('settleUpSaved')}
          </div>
        </div>
      </Overlay>
    </Screen>
  )
}

export default Summary
