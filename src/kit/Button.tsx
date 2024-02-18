import { MainButton, useHapticFeedback, useWebApp } from '@vkruglikov/react-telegram-web-app'
import cx from 'classnames'
import { ReactNode } from 'react'

import { useStore } from '../store'

import Limiter from './Limiter'
import Loader from './Loader'

type TButton = {
  theme?: 'default' | 'text' | 'settleUp' | 'icon' | 'subBottom'
  disabled?: boolean
  isBusy?: boolean
  onClick: () => void
} & ({
  isBottom: true
  text: string,
} | {
  isBottom?: false
  text: string | ReactNode,
})

function Button({ theme = 'default', isBottom, text, disabled, isBusy, onClick }: TButton) {
  const webApp = useWebApp()
  const [impactOccurred] = useHapticFeedback()
  const { overlays } = useStore()

  const onClickVibro = disabled ? () => {/* */} : () => {
    console.log('Button vibro')
    impactOccurred(isBottom ? 'heavy' : 'light')
    onClick()
  }

  if (isBottom && overlays.length) {
    return null
  }

  if (isBottom && webApp.platform !== 'unknown') {
    return (
      <MainButton
        text={text}
        disabled={disabled}
        progress={isBusy}
        color={disabled ? '#888888' : undefined}
        onClick={onClickVibro}
    />)
  }

  const themeStyle = {
    'default': 'mx-auto w-full block h-10 bg-button text-buttonText rounded-md text-[14px] leading-[20px] font-semibold enabled:hover:brightness-110 enabled:active:brightness-[1.2] transition-all',

    'text': 'min-h-[24px] text-[14px] leading-[1.2em] text-button hover:brightness-[1.2] active:brightness-[1.4] transition-all',

    'settleUp': 'min-h-[24px] border border-link rounded-[4px] px-2 text-[14px] leading-[1.2em] text-link hover:brightness-[1.2] active:brightness-[1.4] transition-all whitespace-nowrap',

    'icon': 'block h-[24px] w-[24px] bg-transaprent p-0 opacity-40 text-text hover:opacity-70 active:opacity-100 transition-all',

    'subBottom': 'my-4 mx-auto w-full block h-10 bg-[#7E10E5] text-buttonText rounded-md text-[14px] leading-[24px] font-semibold enabled:hover:brightness-110 enabled:active:brightness-[1.2] transition-all',
  }[theme]

  const button = (
    <button
      className={cx(
        themeStyle,
        isBottom && '!h-[56px]',
        'disabled:opacity-40 disabled:cursor-not-allowed'
      )}
      disabled={disabled || isBusy}
      onClick={onClickVibro}
    >
      {text}
    </button>
  )

  return (
    <div className={cx(isBottom && 'h-[56px]')}>{/* spacer */}
      <div className={cx('ButtonLoaderWrapper', isBottom ? 'fixed bottom-0 left-0 w-full pt-1 bg-bg' : 'relative')}>
        {isBottom && (
          <div className="absolute bottom-full left-0 w-full h-2 bg-gradient-to-t from-bg" />
        )}
        {isBottom
          ? (
            <Limiter>
              {button}
            </Limiter>
          )
          : button
        }
        {isBusy && <Loader size={30} />}
      </div>
    </div>
  )
}

export default Button
