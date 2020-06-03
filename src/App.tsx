import React, { Fragment } from "react"
import { Route } from "react-router-dom"
import HomePage from "pages/home"
import SigninPage from "pages/signin"
import RegisterPage from "pages/register"
import NewsListPage from "pages/news-list"
import JobPostPage from "pages/job-post"
import { useDispatch } from "react-redux"
import { refresh_token } from "features/account-auth"
import FeedbackPage from "pages/feedback"
import NewsArticlePage from "pages/news-article"
import JobListPage from "pages/job-list"
import JobArticlePage from "pages/job-article"
import TermsPage from "pages/terms"
import PrivacyPage from "pages/privacy"
import ActivationPage from "pages/activate"
import ResetPasswordPage from "pages/reset-password"
import ProfileStatsPage from "pages/profile-stats"
import MyApplicationsPage from "pages/my-applications"
import MyPostingsPage from "pages/my-postings"
import PostingDetailsPage from "pages/my-posting-details"
import SavedJobsPage from "pages/saved-jobs"
import FaqPage from "pages/faq"
import SavedSearchesPage from "pages/saved-searches"
import { ROUTES } from "settings"
interface IProps {}

const App: React.FC<IProps> = () => {
  // Refresh Authenticated everytime user refreshes browser.
  const dispatch = useDispatch()
  dispatch(refresh_token(null))
  return (
    <Fragment>
      <Route exact path={ROUTES.HOME} component={HomePage} />
      <Route exact path={ROUTES.ACCOUNT_SIGNIN} component={SigninPage} />
      <Route exact path={ROUTES.ACCOUNT_REGISTER} component={RegisterPage} />
      <Route exact path={ROUTES.NEWS_LIST} component={NewsListPage} />
      <Route exact path={ROUTES.JOB_CREATE} component={JobPostPage} />
      <Route exact path={ROUTES.FEEDBACK} component={FeedbackPage} />
      <Route path={ROUTES.NEWS_ARTICLE} exact component={NewsArticlePage} />
      <Route exact path={ROUTES.JOB_LIST} component={JobListPage} />
      <Route exact path={ROUTES.JOB_ARTICLE} component={JobArticlePage} />
      <Route exact path={ROUTES.ACCOUNT_ACTIVATE} component={ActivationPage} />
      <Route
        exact
        path={ROUTES.ACCOUNT_RESET_PASSWORD}
        component={ResetPasswordPage}
      />
      <Route exact path={ROUTES.PROFILE} component={ProfileStatsPage} />
      <Route
        exact
        path={ROUTES.JOB_APPLICATIONS}
        component={MyApplicationsPage}
      />
      <Route exact path={ROUTES.JOB_POSTINGS} component={MyPostingsPage} />
      <Route exact path={ROUTES.PROFILE_SAVED_JOBS} component={SavedJobsPage} />
      <Route
        exact
        path={ROUTES.PROFILE_SAVED_SEARCH}
        component={SavedSearchesPage}
      />
      <Route
        exact
        path={ROUTES.JOB_POSTING_ARTICLE}
        component={PostingDetailsPage}
      />
      <Route exact path={ROUTES.DOCUMENTATION_TERMS} component={TermsPage} />
      <Route
        exact
        path={ROUTES.DOCUMENTATION_PRIVACY}
        component={PrivacyPage}
      />
      <Route exact path={ROUTES.DOCUMENTATION_FAQ} component={FaqPage} />
    </Fragment>
  )
}

export default App
