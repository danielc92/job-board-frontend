import React, { Fragment } from "react"
import { Route } from "react-router-dom"
import HomePage from "pages/home"
interface IProps {}

const App: React.FC<IProps> = () => {
  return (
    <Fragment>
      <Route exact path="/" component={HomePage}></Route>
    </Fragment>
  )
}

export default App
