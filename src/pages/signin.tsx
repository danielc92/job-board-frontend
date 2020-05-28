import React, { Fragment, useState, useEffect } from "react"
import VerticallyPaddedContainer from "sections/global/VerticallyPaddedContainer"
import {
  Container,
  Image,
  Grid,
  Header,
  Segment,
  Form,
  Message,
  Modal,
  Button,
} from "semantic-ui-react"
import { useDispatch, useSelector } from "react-redux"
import { loginUser, selectUser } from "features/account-auth"
import { RouteComponentProps, useHistory } from "react-router-dom"
import Footer from "sections/global/Footer"
import {
  selectResetRequest,
  resetRequest,
  reset,
} from "features/account-reset-request"
import Navbar from "sections/global/Navbar"

interface RouteProps {
  redirect_message?: string
}

interface IProps extends RouteComponentProps<RouteProps> {}

interface IState {
  email: string
  password: string
  error: boolean
  hidePassword: boolean
}

const SigninPage: React.FC<IProps> = ({ location, history }) => {
  console.log(location, history)
  const [state, setState] = useState<IState>({
    email: "",
    password: "",
    error: false,
    hidePassword: true,
  })

  const historyHook = useHistory()

  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const resetSelector = useSelector(selectResetRequest)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { email, password } = state

    if (email.length > 0 && password.length > 0) {
      dispatch(loginUser({ email, password }))
      setState({ ...state, error: false })
    } else {
      setState({ ...state, error: true })
    }
  }

  const closeModal = () => {
    dispatch(reset())
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState({ ...state, [name]: value.trim() })
  }

  const handleTogglePasswordView = (e: React.FormEvent<HTMLInputElement>) => {
    setState({ ...state, hidePassword: !state.hidePassword })
  }

  const handleResetPassword = () => {
    const { email } = state
    if (email.length > 0) {
      dispatch(resetRequest({ email }))
    }
  }

  useEffect(() => {
    if (user.isAuthenticated) {
      historyHook.push("/")
    }
  }, [historyHook, user.isAuthenticated])

  const { hidePassword, email, error, password } = state
  return (
    <Fragment>
      <Navbar />
      <Container>
        <VerticallyPaddedContainer size="4">
          <Grid columns={2} stackable padded>
            <Grid.Row>
              <Grid.Column>
                <Segment basic>
                  <Header as="h1" content="Login Page" />
                  <p>
                    Unlock all the features by creating an account and signing
                    in.
                  </p>
                  <Form onSubmit={handleSubmit}>
                    <Form.Input
                      icon="at"
                      iconPosition="left"
                      onChange={handleInputChange}
                      placeholder="Enter email here..."
                      label="Email"
                      value={email}
                      name="email"
                    />
                    <Form.Input
                      icon="lock"
                      iconPosition="left"
                      onChange={handleInputChange}
                      type={hidePassword ? "password" : "text"}
                      label="Password"
                      value={password}
                      placeholder="Enter password here..."
                      name="password"
                    />
                    <Form.Radio
                      label={hidePassword ? "Show password" : "Hide password"}
                      toggle
                      onChange={handleTogglePasswordView}
                    />
                    <Message
                      visible={error}
                      warning
                      header="Action forbidden"
                      content="Email and password is required to login."
                    ></Message>

                    {/* {location.state && location.state.redirect_message &&
                      <Message
                        color="blue"
                        header="Session expired"
                        content={location.state.redirect_message}
                      ></Message>
                    )} */}

                    {user.error ? (
                      <Message
                        content={user.error}
                        color="red"
                        header="An error occurred"
                      />
                    ) : null}
                    <Form.Button
                      color="green"
                      size="large"
                      loading={user.isFetching}
                    >
                      Submit
                    </Form.Button>
                    <Modal open={resetSelector.modal_open}>
                      <Modal.Header>{resetSelector.modal_header}</Modal.Header>
                      <Modal.Content>{resetSelector.modal_body}</Modal.Content>
                      <Modal.Actions>
                        <Button onClick={closeModal} color="green">
                          Confirm
                        </Button>
                      </Modal.Actions>
                    </Modal>
                    <p>
                      Forgotten password? Fill in your email above and press the
                      button below.
                    </p>
                    <Button
                      size="tiny"
                      color="green"
                      onClick={(e) => {
                        e.preventDefault()
                        handleResetPassword()
                      }}
                      loading={resetSelector.isFetching}
                    >
                      Reset password
                    </Button>
                  </Form>
                </Segment>
              </Grid.Column>
              <Grid.Column verticalAlign="middle">
                <Image
                  style={{ maxWidth: "350px" }}
                  centered
                  fluid
                  src="/images/fingerprint_swrc.svg"
                ></Image>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </VerticallyPaddedContainer>
      </Container>
      <Footer />
    </Fragment>
  )
}

export default SigninPage
