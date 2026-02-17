import BehavixSdk from 'behavix_sdk'

document.addEventListener('DOMContentLoaded', async () => {
  await BehavixSdk.initialize()
  BehavixSdk.renderStyledConfigPage('#consent-container',
    { termsOfServiceLink: 'MY_TERMS_OF_SERVICE_LINK', privacyPolicyLink: 'MY_PRIVACY_POLICY_LINK' })
})
