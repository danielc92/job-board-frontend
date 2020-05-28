import React, { useState, useEffect, Fragment } from "react"
import {
  Form,
  Image,
  Segment,
  Container,
  Header,
  Grid,
  Modal,
  Button,
  Message,
  InputOnChangeData,
  FormProps,
} from "semantic-ui-react"
import querystring from "querystring"
import VerticallyPaddedContainer from "sections/global/VerticallyPaddedContainer"
import { PasswordMatcher, PasswordValidator } from "utils/validation"
import { useLocation } from "react-router-dom"
import {
  reset,
  selectResetPassword,
  tryResetPassword,
} from "features/account-reset-password"
import { useDispatch, useSelector } from "react-redux"
import Navbar from "sections/global/Navbar"
import Footer from "sections/global/Footer"
import BannerGroup from "sections/global/BannerGroup"

interface IProps {}

interface IState {
  password: string
  password_confirm: string
  validationErrors: string[]
}

const ResetPasswordPage: React.FC<IProps> = () => {
  const [state, setState] = useState<IState>({
    password: "",
    password_confirm: "",
    validationErrors: [],
  })
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const resetPassword = useSelector(selectResetPassword)
  const dispatch = useDispatch()
  const locationSelector = useLocation()

  useEffect(() => {
    const validate = (): void => {
      const { password, password_confirm } = state
      let errors = [
        ...PasswordMatcher(password, password_confirm),
        ...PasswordValidator(password, 8, 20, 6),
      ]
      setValidationErrors(errors)
    }
    validate()
  }, [state])

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => {
    console.log(event)
    setState({ ...state, [event.target.name]: event.target.value })
  }

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    data: FormProps
  ) => {
    event.preventDefault()
    const { validationErrors, password } = state
    const qs = querystring.parse(locationSelector.search.substring(1))

    if (validationErrors.length === 0 && qs.token) {
      const payload = {
        password,
        token: qs.token as string,
      }

      dispatch(tryResetPassword(payload))
    }
  }

  const closeModal = () => {
    dispatch(reset())
  }

  return (
    <Fragment>
      <Navbar />
      <Container>
        <VerticallyPaddedContainer size="4">
          <Grid columns={2} stackable padded>
            <Grid.Row>
              <Grid.Column>
                <Segment basic>
                  <Header as="h1" content="Reset your password" />
                  <p>Please choose a new password below.</p>
                  <Form onSubmit={handleSubmit}>
                    <Form.Input
                      icon="lock"
                      iconPosition="left"
                      onChange={handleInputChange}
                      placeholder="Enter email here..."
                      label="Password"
                      value={state.password}
                      name="password"
                      type="password"
                    />

                    <Form.Input
                      icon="lock"
                      iconPosition="left"
                      onChange={handleInputChange}
                      type="password"
                      label="Confirm password"
                      value={state.password_confirm}
                      placeholder="Enter password here..."
                      name="password_confirm"
                    />

                    <Form.Button color="green" size="large">
                      Reset Password
                    </Form.Button>
                  </Form>

                  {state.validationErrors.length > 0 ? (
                    <Message
                      header="Validation reminder"
                      color="yellow"
                      list={state.validationErrors}
                    ></Message>
                  ) : null}
                  <Modal open={resetPassword.modal_body.length > 0}>
                    <Modal.Header>{resetPassword.modal_header}</Modal.Header>
                    <Modal.Content>{resetPassword.modal_body}</Modal.Content>
                    <Modal.Actions>
                      <Button
                        loading={resetPassword.isFetching}
                        onClick={closeModal}
                        color="green"
                      >
                        Confirm
                      </Button>
                    </Modal.Actions>
                  </Modal>
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
      <BannerGroup showFeedback />
      <Footer />
    </Fragment>
  )
}

export default ResetPasswordPage
