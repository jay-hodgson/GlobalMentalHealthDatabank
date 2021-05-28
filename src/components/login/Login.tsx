import React, { useState } from 'react'
import Alert from '@material-ui/lab/Alert/Alert'
import SignInWithCode from './SignInWithCode'
import ResponsiveStepWrapper from '../common/ResponsiveStepWrapper'
import uk from '../../assets/flags/uk.svg'
import ind from '../../assets/flags/ind.svg'
import za from '../../assets/flags/za.svg'
import us from '../../assets/flags/us.svg'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  Button,
  TextField,
} from '@material-ui/core'
import {
  APP_ID,
  LoggedInUserData,
  SignInData,
  SignInDataPhone,
  Response,
  ENDPOINT,
  SIGN_IN_METHOD,
  ROUTES,
} from '../../types/types'
import {
  callEndpoint,
  makePhone,
  isValidPhoneNumber,
} from '../../helpers/utility'
import { useSessionDataDispatch, useSessionDataState } from '../../AuthContext'
import { ReactComponent as TextSent } from '../../assets/text_sent.svg'
import { useElegibility } from '../registration/context/ElegibilityContext'
export interface OwnLoginProps {
  redirectUrl?: string // will redirect here after a successful login. if unset, reload the current page url.
}

export type LoginProps = OwnLoginProps

const PHONE_SIGN_IN_TRIGGER_ENDPOINT = '/v3/auth/phone'

const FLAGS = {
  unitedKingdom: 'UK',
  india: 'IN',
  southAfrica: 'ZA',
  unitedStates: 'US',
}

export const Login: React.FunctionComponent = () => {
  const { push } = useHistory()
  const [error, setError] = useState('')
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { t } = useTranslation()

  const sessionData = useSessionDataState()
  const sessionUpdateFn = useSessionDataDispatch()

  const { phoneNumber, setPhoneNumber, whereDoYouLive, setWhereDoYouLive } =
    useElegibility()

  if (!whereDoYouLive || whereDoYouLive === 'Other') {
    setWhereDoYouLive(FLAGS.unitedKingdom)
    setPhoneNumber('')
  }

  const handleLoggedIn = async (loggedIn: Response<LoggedInUserData>) => {
    const consented = loggedIn.status !== 412
    if (loggedIn.ok || !consented) {
      sessionUpdateFn({
        type: 'LOGIN',
        payload: {
          ...sessionData,
          token: loggedIn.data.sessionToken,
          name: loggedIn.data.firstName,
          consented: loggedIn.data.consented,
          userDataGroup: loggedIn.data.dataGroups,
        },
      })
      push(ROUTES.CONSENT_STEPS)
    } else {
      setError('Error ' + loggedIn.status)
    }
  }

  /**
   * Handle user login on click
   *
   * @param {*} clickEvent Userclick event
   */

  const sendSignInRequest = async (
    _loginType: string,
    phoneNumber: string,
    phoneCountryCode: string,
    endpoint: string,
  ): Promise<any> => {
    let postData: SignInData
    postData = {
      appId: APP_ID,
      phone: makePhone(phoneNumber, phoneCountryCode),
    } as SignInDataPhone

    try {
      setError('')
      return callEndpoint<LoggedInUserData>(endpoint, 'POST', postData)
    } catch (e) {
      throw e
    }
  }

  const handleLogin = async (
    clickEvent: React.FormEvent<HTMLElement>,
  ): Promise<any> => {
    clickEvent.preventDefault()

    try {
      setIsLoading(true)
      setError('')
      await sendSignInRequest(
        SIGN_IN_METHOD,
        phoneNumber,
        whereDoYouLive,
        `${ENDPOINT}${PHONE_SIGN_IN_TRIGGER_ENDPOINT}`,
      )
      setIsCodeSent(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ResponsiveStepWrapper variant="card">
      <div className="login-wrapper">
        <div className="quiz-wrapper">
          {!isCodeSent && (
            <>
              <div className="icon-wrapper">
                <TextSent width="75" />
              </div>
              {isLoading && (
                <div className="loading-icon">
                  <CircularProgress color="primary" />
                </div>
              )}

              <div className="btm-50 text-center">
                <Typography variant="h4">{t('common.signIn')}</Typography>
              </div>
              <form onSubmit={handleLogin}>
                <div className="btm-50 input--padded--flags">
                  <Select
                    variant="outlined"
                    className="phone-flag"
                    value={whereDoYouLive}
                    onChange={(
                      event: React.ChangeEvent<{ value: unknown }>,
                    ) => {
                      setWhereDoYouLive(event.target.value as any)
                    }}
                  >
                    <MenuItem value={FLAGS.unitedKingdom}>
                      <img
                        src={uk}
                        className={'flag-icon'}
                        alt="United Kingdom"
                      />
                    </MenuItem>
                    <MenuItem value={FLAGS.india}>
                      <img src={ind} className={'flag-icon'} alt="India" />
                    </MenuItem>
                    <MenuItem value={FLAGS.southAfrica}>
                      <img
                        src={za}
                        className={'flag-icon'}
                        alt="South Africa"
                      />
                    </MenuItem>
                    <MenuItem value={FLAGS.unitedStates}>
                      <img
                        src={us}
                        className={'flag-icon'}
                        alt="United States"
                      />
                    </MenuItem>
                  </Select>

                  <TextField
                    fullWidth
                    variant="outlined"
                    autoComplete="phone"
                    label="Phone #"
                    type="phone"
                    value={phoneNumber}
                    onChange={(
                      event: React.ChangeEvent<{ value: unknown }>,
                    ) => {
                      const value = event.currentTarget.value as any
                      if (isValidPhoneNumber(value) || !value)
                        setPhoneNumber(value as any)
                    }}
                  />
                </div>

                {error && (
                  <div className="tp-40-neg">
                    <Alert severity="error">{error}</Alert>
                  </div>
                )}

                <Button
                  className="wide-button"
                  color="primary"
                  variant="contained"
                  size="large"
                  type="submit"
                  onSubmit={handleLogin}
                >
                  {t('common.signIn')}
                </Button>
              </form>
            </>
          )}

          {isCodeSent && (
            <SignInWithCode
              loggedInByPhoneFn={(result: Response<LoggedInUserData>) =>
                handleLoggedIn(result)
              }
            />
          )}

          {!isCodeSent && (
            <Button
              variant="text"
              onClick={() => (window.location.href = 'eligibility')}
            >
              {t('common.signUpForAccount')}
            </Button>
          )}
        </div>
      </div>
    </ResponsiveStepWrapper>
  )
}

export default Login
