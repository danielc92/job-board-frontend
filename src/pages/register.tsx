import React, { useState, useEffect, Fragment } from "react"
import { useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  Container,
  Form,
  Header,
  Segment,
  Button,
  Modal,
  Message,
} from "semantic-ui-react"
import VerticallyPaddedContainer from "sections/global/VerticallyPaddedContainer"
import {
  StringValidator,
  StringCharacterValidator,
  PasswordValidator,
  PasswordMatcher,
  EmailValidator,
} from "utils/validation"
import { ALLOWED_CHARS_HUMAN_NAME } from "settings"
import { selectRegister, reset, registerUser } from "features/register"
import Footer from "sections/global/Footer"
import Navbar from "sections/global/Navbar"

interface IProps {}

interface IState {
  email: string
  password: string
  confirm_password: string
  first_name: string
  last_name: string
  is_employer: boolean
}

const RegisterPage: React.FC<IProps> = () => {
  const historySelector = useHistory()
  const dispatch = useDispatch()
  const register = useSelector(selectRegister)
  const [state, setState] = useState<IState>({
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    is_employer: false,
  })
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    const validateForm = () => {
      const { email, password, confirm_password, first_name, last_name } = state

      let errors = [
        ...StringValidator(first_name, 1, 100, "First name"),
        ...StringCharacterValidator(
          first_name,
          ALLOWED_CHARS_HUMAN_NAME,
          "First name"
        ),
        ...StringValidator(last_name, 1, 100, "Last name"),
        ...StringCharacterValidator(
          last_name,
          ALLOWED_CHARS_HUMAN_NAME,
          "Last name"
        ),
        ...PasswordMatcher(password, confirm_password),
        ...PasswordValidator(password, 8, 20, 6),
        ...EmailValidator(email, 6, 100),
      ]

      setErrors(errors)
    }
    validateForm()
  }, [state])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target
    setState({ ...state, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { email, password, first_name, last_name, is_employer } = state

    if (errors.length === 0) {
      dispatch(
        registerUser({
          password,
          first_name,
          last_name,
          is_employer,
          email,
        })
      )
    }
  }

  const handleRadioChange = () => {
    setState({ ...state, is_employer: !state.is_employer })
  }

  const closeModal = () => {
    dispatch(reset())
  }

  const handleNavigateToLogin = () => {
    dispatch(reset())
    historySelector.push("/sign-in")
  }

  return (
    <Fragment>
      <Navbar />
      <Container text>
        <VerticallyPaddedContainer size="4">
          <Segment basic>
            <Header as="h1" content="Join the community" />

            <Form onSubmit={handleSubmit}>
              <Form.Input
                icon="at"
                iconPosition="left"
                onChange={handleInputChange}
                placeholder="Enter email here..."
                label="Email"
                value={state.email}
                name="email"
              />

              <Form.Input
                type="password"
                icon="lock"
                iconPosition="left"
                onChange={handleInputChange}
                placeholder="Enter password here..."
                label="Password"
                value={state.password}
                name="password"
              />

              <Form.Input
                type="password"
                icon="lock"
                iconPosition="left"
                onChange={handleInputChange}
                placeholder="Enter password again..."
                label="Confirm Password"
                value={state.confirm_password}
                name="confirm_password"
              />

              <Form.Input
                icon="user circle"
                iconPosition="left"
                onChange={handleInputChange}
                placeholder="Jane"
                label="First name"
                value={state.first_name}
                name="first_name"
              />

              <Form.Input
                icon="user circle"
                iconPosition="left"
                onChange={handleInputChange}
                placeholder="Doe"
                label="Last name"
                value={state.last_name}
                name="last_name"
              />

              <Form.Field>
                <label>
                  I am{" "}
                  <strong>
                    {state.is_employer ? "an employer" : "a job seeker"}
                  </strong>
                </label>
              </Form.Field>
              <Form.Radio toggle onChange={handleRadioChange}></Form.Radio>
              <Form.Button
                loading={register.isFetching}
                disabled={errors.length > 0}
                size="large"
                color="green"
              >
                Create account
              </Form.Button>

              <Message
                warning
                list={errors}
                header="Rules"
                visible={errors.length > 0}
              ></Message>
            </Form>
          </Segment>
        </VerticallyPaddedContainer>
        <Modal
          open={register.modal_open}
          dimmer="blurring"
          onClose={closeModal}
        >
          <Modal.Header>{register.modal_header}</Modal.Header>
          <Modal.Content>{register.modal_body}</Modal.Content>
          <Modal.Actions>
            <Button onClick={handleNavigateToLogin} color="green">
              Go to login page
            </Button>
          </Modal.Actions>
        </Modal>
      </Container>
      <Footer />
    </Fragment>
  )
}

export default RegisterPage
