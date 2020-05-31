import accountAuth from "features/account-auth"
import benefits from "features/benefits"
import categories from "features/categories"
import documentation from "features/documentation"
import feedback from "features/feedback"
import jobApply from "features/job-application"
import jobArticle from "features/job-article"
import jobList from "features/job-list"
import jobPost from "features/job-post"
import locations from "features/locations"
import news from "features/news-list"
import profile from "features/account-profile"
import applicationUpdate from "features/job-application-update"
import myApplications from "features/my-applications"
import newsArticle from "features/news-article"
import register from "features/register"
import resetPassword from "features/account-reset-password"
import resetRequest from "features/account-reset-request"
import myPostings from "features/my-postings"
import accountActivation from "features/account-activate"
import profileUpdate from "features/account-update-profile"
import jobUpdateStatus from "features/job-status-update"
import skills from "features/skills"
import myDetailsUpdate from "features/account-update-details"
import myDetails from "features/account-details"
import myPostingDetails from "features/my-posting-details"
import { combineReducers, Action } from "@reduxjs/toolkit"
import { TOKEN_NAME } from "settings"

const appReducer = combineReducers({
  accountAuth,
  myApplications,
  myPostingDetails,
  myPostings,
  applicationUpdate,
  accountActivation,
  profile,
  myDetails,
  myDetailsUpdate,
  jobUpdateStatus,
  benefits,
  categories,
  resetPassword,
  documentation,
  profileUpdate,
  feedback,
  jobApply,
  jobArticle,
  jobList,
  jobPost,
  locations,
  news,
  newsArticle,
  register,
  resetRequest,
  skills,
})

export const rootReducer = (state: any, action: Action) => {
  if (action.type === "LOGOUT_SUCCESS") {
    localStorage.removeItem(TOKEN_NAME)
    state = undefined
  }
  return appReducer(state, action)
}
