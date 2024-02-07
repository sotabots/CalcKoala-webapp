export type TUserId = number // tg id

export type TChatId = number

export type TUser = { // tg user
  _id: TUserId
  username?: string // @username without @
  first_name: string
  last_name?: string
  profile_photo: string | null // avatar url

  _name?: string // not used, only for mock, will be removed
}

export type TTransaction = {
  _id: string
  chat_id: TChatId | null
  creator_user_id: TUserId | null
  is_voice: boolean
  raw_text: string // shown if `formatted_text` does not exist
  formatted_text?: string // with <b>Name</b> highlighting
  currency_id: TCurrencyId
  is_confirmed: boolean // set true before patch
  shares: TShare[]
  // todo: improve
}

export type TNewTransaction = Omit<TTransaction, '_id'>

export type TShare = {
  person_id: string
  raw_name: string | null
  normalized_name: string | null // may be missing if a new user is selected
  is_payer: boolean // paid or owed
  amount: number
  user_candidates: /*[] |*/ null // todo
  related_user_id: TUserId | null
}

export type TCurrencyId = string // 'RUB' | 'GEL' | 'TRY' | 'EUR'

export type TCurrency = {
  _id: TCurrencyId, // 'EUR'
  title: string, // 'Euro'
  symbol: string, // '€'
  in: string // 'In Euros'
}

export type TChat = {
  _id: number,
  name: string,
  summary_id: string | null
  // users: ...
  // names: ...
  // transations: ...
  default_currency: string | null
  status: 'member' | 'administrator' | 'left' | null
  welcome_message_id: number | null
  menu_message_id: number | null
  pin_message_id: number | null
  language_code: 'en' | 'ru' | 'uk'
}

export type TSummary = {
  debts: TDebt[]
  url: string
  chat_id: TChatId
}

export type TDebt = {
  from_user: TUser
  to_user: TUser
  amount: number
  currency_id: TCurrencyId
}
