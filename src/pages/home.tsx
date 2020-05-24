import React, { Fragment } from "react"
import { useSelector, useDispatch } from "react-redux"
import { selectUser, loginUser } from "features/account-auth"
import Footer from "sections/global/Footer"

interface IProps {}

const HomePage: React.FC<IProps> = () => {
  const user = useSelector(selectUser)
  const dispatch = useDispatch()
  return (
    <Fragment>
      <button
        onClick={() =>
          dispatch(
            loginUser({ email: "test2@test.com", password: "123456789d" })
          )
        }
      >
        Login
      </button>
      <button></button>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur vel
        debitis deserunt at accusantium molestias aspernatur dolorum dolore,
        nobis consequuntur! Pariatur voluptatibus odio sapiente fuga id mollitia
        est consequatur nam?
      </p>
      <Footer />
    </Fragment>
  )
}

export default HomePage
