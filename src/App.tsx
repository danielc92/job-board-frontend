import React, { Fragment } from "react"
import { Route } from "react-router-dom"
import HomePage from "pages/home"
import SigninPage from "pages/signin"
import RegisterPage from "pages/register"
import NewsListPage from "pages/news-list"

interface IProps {}

const App: React.FC<IProps> = () => {
  return (
    <Fragment>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/sign-in" component={SigninPage} />
      <Route exact path="/register" component={RegisterPage} />
      <Route exact path="/news-list" component={NewsListPage} />
    </Fragment>
  )
}

export default App
