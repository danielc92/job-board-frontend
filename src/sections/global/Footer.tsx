import React, { Fragment } from "react"
import { Container, Segment, Grid, List, Header } from "semantic-ui-react"
import { Link } from "react-router-dom"
import { ROUTES } from "settings"
interface IProps {}

const Footer: React.FC<IProps> = () => {
  return (
    <Fragment>
      <Segment
        color="violet"
        inverted
        style={{ borderRadius: "0", padding: "5em 0em", margin: "0" }}
      >
        <Container>
          <Grid divided inverted stackable>
            <Grid.Row>
              <Grid.Column width={4}>
                <Header inverted as="h4" content="Navigation" />
                <List link inverted>
                  <List.Item as={Link} to={ROUTES.HOME} content="Home" />
                  <List.Item
                    as={Link}
                    to={ROUTES.JOB_LIST}
                    content="Explore jobs"
                  />
                  <List.Item as={Link} to={ROUTES.NEWS_LIST} content="News" />
                  <List.Item
                    as={Link}
                    to={ROUTES.ACCOUNT_SIGNIN}
                    content="Sign in"
                  />
                  <List.Item
                    as={Link}
                    to={ROUTES.ACCOUNT_REGISTER}
                    content="Register"
                  />
                </List>
              </Grid.Column>
              <Grid.Column width={4}>
                <Header inverted as="h4" content="Documentation" />
                <List link inverted>
                  <List.Item
                    as={Link}
                    to={ROUTES.DOCUMENTATION_TERMS}
                    content="Terms of use"
                  />
                  <List.Item
                    as={Link}
                    to={ROUTES.DOCUMENTATION_PRIVACY}
                    content="Privacy policy"
                  />
                  <List.Item
                    as={Link}
                    to={ROUTES.DOCUMENTATION_FAQ}
                    content="FAQ"
                  />
                </List>
              </Grid.Column>
              <Grid.Column width={4}>
                <Header inverted as="h4" content="Contact" />
                <List link inverted>
                  <List.Item as={Link} to={ROUTES.FEEDBACK}>
                    Send feedback
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Segment>
      <Segment
        color="black"
        inverted
        basic
        textAlign="center"
        style={{ margin: "0" }}
      >
        Created with{" "}
        <span role="img" aria-label="with-love-heart">
          ❤️
        </span>
      </Segment>
    </Fragment>
  )
}

export default Footer
