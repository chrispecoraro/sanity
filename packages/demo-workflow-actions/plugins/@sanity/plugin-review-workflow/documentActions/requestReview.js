// import React from 'react'
import {createAction} from 'part:@sanity/base/actions/utils'
import EyeIcon from 'part:@sanity/base/eye-icon'
import {useMetadata} from '../store'
import {inferInitialState} from './_helpers'

export const requestReviewAction = createAction(props => {
  const showWizardDialog = false
  // const [showWizardDialog, setShowWizardDialog] = React.useState(false)
  const metadata = useMetadata(props.id, inferInitialState(props))

  // console.log('requestReviewAction', metadata)

  if (metadata && !['draft', 'changesRequested'].includes(metadata.state)) {
    return {
      disabled: true,
      icon: EyeIcon,
      label: 'Request review'
    }
  }

  const onHandle = async () => {
    // if (!showWizardDialog) {
    //   setShowWizardDialog(true)
    //   return
    // }
    metadata.setState('inReview')
    // console.log('requestReviewAction.handle', metadata)
  }

  return {
    // dialog: showWizardDialog && <div>Wizard</div>,
    disabled: showWizardDialog || !metadata,
    icon: EyeIcon,
    label: 'Request review',
    onHandle
  }
})
