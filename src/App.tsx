import React, { Fragment } from "react"
import { Route } from "react-router-dom"
import HomePage from "pages/home"
import SigninPage from "pages/signin"
interface IProps {}

const App: React.FC<IProps> = () => {
  return (
    <Fragment>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/sign-in" component={SigninPage} />
    </Fragment>
  )
}

export default App
