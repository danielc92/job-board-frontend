import React from "react"
import { Menu, Container, Button } from "semantic-ui-react"
import { selectUser } from "features/account-auth"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
interface IProps {}

const Navbar: React.FC<IProps> = () => {
  const user = useSelector(selectUser)

  const handleLogout = (): void => {
    // this.props.propsLogoutUser()
    console.log("Logging out.")
  }

  return (
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
        <Menu.Item as={Link} to="/dashboard" name="dashboard" />

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
  )
}

export default Navbar
