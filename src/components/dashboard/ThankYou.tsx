import React from 'react'
import { Button, Typography } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ResponsiveStepWrapper from '../common/ResponsiveStepWrapper'
import { ReactComponent as LogoNoText } from 'assets/logo-no-text.svg'
import Application from '../../assets/za_docs/DHET_Application.pdf'
import Letter from '../../assets/za_docs/DHET_Approval_letter.pdf'
import Certificate from '../../assets/za_docs/Clearance_Certificate.pdf'
import { ROUTES } from 'constants/constants'

type Props = {
  updateClientData: (fields: object) => void
}

function ThankYou({ updateClientData }: Props) {
  const { t } = useTranslation()
  const { push } = useHistory()
  const handleClick = () => {
    updateClientData({ skipThankYou: true })
    push(ROUTES.DOWNLOAD)
  }
  return (
    <ResponsiveStepWrapper variant="card">
      <div className="quiz-wrapper">
        <LogoNoText className="logo btm-20" />
        <div className="btm-30">
          <Typography variant="h3">{t('thankYou.title')}</Typography>
          <Typography variant="body2">{t('thankYou.subtitle')}</Typography>
          <ol style={{ fontSize: '1.4rem' }}>
            <li>{t('thankYou.text1')}</li>
            <li>
              {t('thankYou.view')}{' '}
              <a
                className="btm-10"
                href={Application}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('thankYou.link1')}
              </a>{' '}
              {t('thankYou.text2')}
            </li>
            <li>
              {t('thankYou.view')}{' '}
              <a
                className="btm-10"
                href={Letter}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('thankYou.link2')}
              </a>
            </li>
            <li>
              {t('thankYou.view')}{' '}
              <a
                className="btm-10"
                href={Certificate}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('thankYou.link3')}
              </a>
            </li>
          </ol>
        </div>

        <Button
          color="primary"
          variant="contained"
          size="large"
          className="wide-button"
          onClick={handleClick}
        >
          Download the app
        </Button>
      </div>
    </ResponsiveStepWrapper>
  )
}

export default ThankYou
