import mixpanel from 'mixpanel-browser'

const envToken = import.meta.env.VITE_FEEDBACK_TOKEN
const isToken = !!envToken
const token = envToken || 'NO_TOKEN' // some string is needed

const EVENT = {
  OPEN_WEBAPP: 'open_webapp',
  OPEN_PAGE_TRANSACTION: 'open_page_transaction',
  OPEN_PAGE_SUMMARY: 'open_page_summary',
  SEND_TRANSACTION: 'send_transaction',
  OPEN_PAYWALL: 'open_paywall'
}

const feedback = async (event: string) => {
  if (isToken) {
    console.info('[mixpanel]', event)
    await mixpanel.track(event)
  } else {
    console.warn('[mixpanel: no token]', event)
  }
}

mixpanel.init(token, {
  // debug: true,
  loaded: () => {
    feedback(EVENT.OPEN_WEBAPP)
  }
})


export { feedback, EVENT }
