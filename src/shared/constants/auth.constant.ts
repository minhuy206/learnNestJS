export const REQUEST_USER_KEY = 'user'

export const AUTH_TYPES = {
  Bearer: 'Bearer',
  None: 'None',
  APIKey: 'APIKey',
} as const

export type AuthTypeType = (typeof AUTH_TYPES)[keyof typeof AUTH_TYPES]

export const CONDITION_GUARD = {
  And: 'and',
  Or: 'or',
} as const

export type ConditionGuardType = (typeof CONDITION_GUARD)[keyof typeof CONDITION_GUARD]
