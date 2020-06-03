import React, { Fragment } from "react"
import { Menu, Container, Button } from "semantic-ui-react"
import { selectUser, logoutUser } from "features/account-auth"
import { useSelector, useDispatch } from "react-redux"
import { Link, useHistory } from "react-router-dom"
import ImportantAlert from "./ImportantAlert"
import { ROUTES } from "settings"

interface IProps {}

const Navbar: React.FC<IProps> = () => {
  const user = useSelector(selectUser)
  const dispatch = useDispatch()
  const history = useHistory()
  const handleLogout = (): void => {
    dispatch(logoutUser())
    history.push(ROUTES.ACCOUNT_SIGNIN)
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
          <Menu.Item as={Link} to={ROUTES.HOME} name="Home"></Menu.Item>

          <Menu.Item as={Link} to={ROUTES.JOB_LIST} name="Explore jobs" />
          <Menu.Item as={Link} to={ROUTES.JOB_CREATE} name="Post jobs" />
          <Menu.Item as={Link} to={ROUTES.NEWS_LIST} name="news" />
          <Menu.Item as={Link} to={ROUTES.PROFILE} name="profile" />
          <Menu.Item
            as={Link}
            to={ROUTES.PROFILE_SAVED_JOBS}
            name="saved jobs"
          />
          <Menu.Item
            as={Link}
            to={ROUTES.PROFILE_SAVED_SEARCH}
            name="saved search"
          />
          {user.isAuthenticated && user.user && user.user.is_employer ? (
            <Menu.Item as={Link} to={ROUTES.JOB_POSTINGS} name="my postings" />
          ) : user.isAuthenticated && user.user && !user.user.is_employer ? (
            <Menu.Item
              as={Link}
              to={ROUTES.JOB_APPLICATIONS}
              name="my applications"
            />
          ) : null}

          <Menu.Menu position="right">
            <Menu.Item>
              <div>
                {user.isAuthenticated ? (
                  <Button onClick={handleLogout}>Logout</Button>
                ) : (
                  <Button.Group>
                    <Button color="violet" as={Link} to={ROUTES.ACCOUNT_SIGNIN}>
                      Sign in
                    </Button>

                    <Button.Or />

                    <Button
                      as={Link}
                      to={ROUTES.ACCOUNT_REGISTER}
                      color="green"
                    >
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
