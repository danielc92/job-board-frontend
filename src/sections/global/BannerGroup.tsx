import React, { Fragment } from "react"
import FeedbackBanner from "./FeedbackBanner"

interface IProps {
  showFeedback: boolean
}
const BannerGroup: React.FC<IProps> = ({ showFeedback }) => {
  return <Fragment>{showFeedback ? <FeedbackBanner /> : null}</Fragment>
}

export default BannerGroup
