import React, { Fragment } from "react"
import { Menu, Container, Button } from "semantic-ui-react"
import { selectUser, logoutUser } from "features/account-auth"
import { useSelector, useDispatch } from "react-redux"
import { Link, useHistory } from "react-router-dom"
import ImportantAlert from "./ImportantAlert"
interface IProps {}

const Navbar: React.FC<IProps> = () => {
  const user = useSelector(selectUser)
  const dispatch = useDispatch()
  const history = useHistory()
  const handleLogout = (): void => {
    dispatch(logoutUser())
    history.push("/sign-in")
  }

  return (
    <Fragment>
      <ImportantAlert message="This website is currently in development phase." />
      <Menu
        color="violet"
        pointing
        stackable
        style={{ margin: "0", borderRadius: "0", boxShadow: "none" }}
      >
        <Container>
          <Menu.Item>
            <img
              alt="Brand logo"
              style={{ transform: "scale(1.5)" }}
              src="/logo/logo-cube.svg"
            />
          </Menu.Item>
          <Menu.Item as={Link} to="/" name="Home"></Menu.Item>

          <Menu.Item as={Link} to="/job-list" name="Explore jobs" />
          <Menu.Item as={Link} to="/create-jobs" name="Post jobs" />
          <Menu.Item as={Link} to="/news-list" name="news" />
          <Menu.Item as={Link} to="/profile" name="profile" />
          <Menu.Item as={Link} to="/my-applications" name="my applications" />
          <Menu.Item as={Link} to="/my-postings" name="my postings" />

          <Menu.Menu position="right">
            <Menu.Item>
              <div>
                {user.isAuthenticated ? (
                  <Button secondary onClick={handleLogout}>
                    Logout
                  </Button>
                ) : (
                  <Button.Group>
                    <Button color="violet" as={Link} to="/sign-in">
                      Sign in
                    </Button>

                    <Button.Or />

                    <Button as={Link} to="/register" color="green">
                      Register
                    </Button>
                  </Button.Group>
                )}
              </div>
            </Menu.Item>
            {!user.isAuthenticated ? <Menu.Item></Menu.Item> : null}
          </Menu.Menu>
        </Container>
      </Menu>
    </Fragment>
  )
}

export default Navbar
