import React, { Fragment } from "react"
import {
  Menu,
  Container,
  Button,
  Dropdown,
  DropdownDivider,
} from "semantic-ui-react"
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
          <Menu.Item as={Link} to={ROUTES.NEWS_LIST} name="news" />

          <Dropdown item text="More" pointing>
            <Dropdown.Menu>
              <DropdownDivider style={{ marginTop: 0 }} />
              <Dropdown.Item
                text="Provide feedback"
                as={Link}
                to={ROUTES.FEEDBACK}
              />
              <DropdownDivider />
              <Dropdown.Item
                text="FAQ"
                to={ROUTES.DOCUMENTATION_FAQ}
                as={Link}
              ></Dropdown.Item>
              <DropdownDivider style={{ marginBottom: 0 }} />
            </Dropdown.Menu>
          </Dropdown>

          {user.isAuthenticated && user.user && (
            <Dropdown item text={user.user.email} pointing>
              <Dropdown.Menu>
                {user.isAuthenticated && user.user && user.user.is_employer ? (
                  <Fragment>
                    <DropdownDivider style={{ marginTop: 0 }} />
                    <Dropdown.Item
                      as={Link}
                      to={ROUTES.JOB_CREATE}
                      text="Post a job"
                    />
                    <DropdownDivider />

                    <Dropdown.Item
                      as={Link}
                      to={ROUTES.JOB_POSTINGS}
                      text="My postings"
                    />
                  </Fragment>
                ) : user.isAuthenticated &&
                  user.user &&
                  !user.user.is_employer ? (
                  <Fragment>
                    <DropdownDivider style={{ marginTop: 0 }} />
                    <Dropdown.Item
                      as={Link}
                      to={ROUTES.JOB_APPLICATIONS}
                      text="My applications"
                    />
                  </Fragment>
                ) : null}
                <DropdownDivider />
                <Dropdown.Item as={Link} to={ROUTES.PROFILE} text="Profile" />
                <DropdownDivider />
                <Dropdown.Item
                  as={Link}
                  to={ROUTES.PROFILE_SAVED_JOBS}
                  text="Saved jobs"
                />
                <DropdownDivider />
                <Dropdown.Item
                  as={Link}
                  to={ROUTES.PROFILE_SAVED_SEARCH}
                  text="Saved search"
                />
                <DropdownDivider style={{ marginBottom: 0 }} />
              </Dropdown.Menu>
            </Dropdown>
          )}

          <Menu.Menu position="right">
            <Menu.Item>
              <div>
                {user.isAuthenticated ? (
                  <Button onClick={handleLogout}>Logout</Button>
                ) : (
                  <Button.Group>
                    <Button color="green" as={Link} to={ROUTES.ACCOUNT_SIGNIN}>
                      Sign in
                    </Button>

                    <Button.Or />

                    <Button
                      as={Link}
                      to={ROUTES.ACCOUNT_REGISTER}
                      color="violet"
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
