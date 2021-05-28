import React from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Typography } from '@material-ui/core'
import { ROUTES } from '../../constants/constants'

function ConsentInfo() {
  const { t } = useTranslation()
  const { push } = useHistory()
  const goToEligibility = () => {
    push(ROUTES.ELIGIBILITY)
  }
  return (
    <div className="consent-info">
      <div className="consent-content">
        <div className="plus-signs" />
        <Typography variant="h2">{t('consent.title')}</Typography>
        <Typography variant="h4">{t('consent.description')}</Typography>
      </div>
      <div>
        <div className="download-files">
          <div className="btm-50">
            <Typography variant="h2">{t('consent.download')}</Typography>
          </div>
          <div className="btm-40 underlined-link">
            <a
              href={ROUTES.CONSENT_PDF_DOWNLOAD_ENGLISH}
              target="_blank"
              rel="noopener noreferrer"
              className="underlined-link"
            >
              <Typography variant="h4">{t('consent.file1')}</Typography>
            </a>
          </div>
          <div className="btm-40 underlined-link">
            <a
              href={ROUTES.CONSENT_PDF_DOWNLOAD_XHOSA}
              target="_blank"
              rel="noopener noreferrer"
              className="underlined-link"
            >
              <Typography variant="h4">{t('consent.file2')}</Typography>
            </a>
          </div>
          <div className="btm-40 underlined-link">
            <a
              href={ROUTES.CONSENT_PDF_DOWNLOAD_SESOTHO}
              target="_blank"
              rel="noopener noreferrer"
              className="underlined-link"
            >
              <Typography variant="h4">{t('consent.file3')}</Typography>
            </a>
          </div>
        </div>
      </div>

      <div className="ready-to-join">
        <div className="butterfly" />
        <div className="text-section">
          <Typography variant="h2">{t('about.readyToJoin.title')}</Typography>
          <Typography>{t('about.readyToJoin.text')}</Typography>
        </div>
        <div className="button-section">
          <div className="butterflies"></div>
          <button onClick={goToEligibility} className="button-join-study">
            {t('common.joinStudy')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConsentInfo
