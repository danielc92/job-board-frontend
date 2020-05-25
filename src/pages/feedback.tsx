import React, { useState, Fragment } from "react"
import {
  Form,
  Image,
  Segment,
  Container,
  Header,
  Button,
  Grid,
  Modal,
  DropdownProps,
} from "semantic-ui-react"
import { useSelector, useDispatch } from "react-redux"
import { reset, selectFeedback, postFeedback } from "features/feedback"
import VerticallyPaddedContainer from "sections/global/VerticallyPaddedContainer"
import Navbar from "sections/global/Navbar"
import Footer from "sections/global/Footer"

const feedbackOptions = [
  { text: "General feedback", value: "general" },
  { text: "Suggest a new feature", value: "suggestion" },
  { text: "Report an issue", value: "report" },
  { text: "Other", value: "other" },
]

interface IProps {}

interface IState {
  category: string
  message: string
}

const FeedbackPage: React.FC<IProps> = () => {
  const dispatch = useDispatch()
  const feedback = useSelector(selectFeedback)
  const [state, setState] = useState<IState>({
    category: "",
    message: "",
  })

  const handleDropDownChange = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) => {
    setState({ ...state, [data.name]: data.value })
  }

  const handleTextareaChange = (e: any) => {
    if (e.target && e) {
      setState({ ...state, [e.target.name]: e.target.value })
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { category, message } = state
    dispatch(
      postFeedback({
        category,
        message,
      })
    )
  }

  const closeModal = (): void => {
    dispatch(reset())
  }

  const { message, category } = state
  return (
    <Fragment>
      <Navbar />
      <Container>
        <VerticallyPaddedContainer size="4">
          <Grid columns={2} stackable padded>
            <Grid.Row>
              <Grid.Column>
                <Segment basic>
                  <Header as="h1" content="Feedback Page" />
                  <p>
                    It's important that we hear your feedback, so that we can
                    improve our services for everyone.
                  </p>
                  <Form onSubmit={handleSubmit}>
                    <Form.Field>
                      <Form.Dropdown
                        name="category"
                        onChange={handleDropDownChange}
                        search
                        selection
                        placeholder="Choose a category from the list.."
                        options={feedbackOptions}
                        maxLength={500}
                        label={`Category`}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Form.TextArea
                        rows={7}
                        onChange={handleTextareaChange}
                        placeholder="Adding this new feature would be great..."
                        maxLength={500}
                        label={`Message (${
                          500 - message.length
                        } chars remaining)`}
                        name="message"
                      />
                    </Form.Field>

                    <Form.Button
                      disabled={message.length === 0 || category.length === 0}
                      color="green"
                      size="large"
                      loading={feedback.isFetching}
                    >
                      Submit
                    </Form.Button>
                  </Form>
                </Segment>
                <Modal open={feedback.modalContent.length > 0}>
                  <Modal.Header>{feedback.modalHeader}</Modal.Header>
                  <Modal.Content>{feedback.modalContent}</Modal.Content>
                  <Modal.Actions>
                    <Button onClick={closeModal} color="green">
                      Confirm
                    </Button>
                  </Modal.Actions>
                </Modal>
              </Grid.Column>
              <Grid.Column verticalAlign="middle">
                <Image
                  style={{ maxWidth: "350px" }}
                  centered
                  fluid
                  src="/images/feedback.svg"
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

export default FeedbackPage
