import React, { Component, Fragment, useEffect } from "react"
import {
  Image,
  Segment,
  Container,
  Modal,
  Header,
  Button,
  Grid,
} from "semantic-ui-react"
import querystring from "querystring"
import { useSelector, useDispatch } from "react-redux"
import {
  selectAccountActivation,
  reset,
  activateAccount,
} from "features/account-activate"
import Navbar from "sections/global/Navbar"
import Footer from "sections/global/Footer"
import { useLocation } from "react-router-dom"
import VerticallyPaddedContainer from "sections/global/VerticallyPaddedContainer"

interface IProps {}
const ActivationPage: React.FC<IProps> = () => {
  const dispatch = useDispatch()
  const accountActivation = useSelector(selectAccountActivation)
  const locationSelector = useLocation()

  useEffect(() => {
    const parsedQs = querystring.parse(locationSelector.search.substring(1))
    if (parsedQs.token) {
      dispatch(activateAccount(parsedQs.token as string))
    }
  }, [dispatch, locationSelector])

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
                  <Header as="h1" content="Activation Page" />
                  <p>
                    You're at this page because you have clicked on an email
                    link to activate your account. Please wait while we activate
                    your account.
                  </p>
                  <Modal open={accountActivation.modal_header.length > 0}>
                    <Modal.Header>
                      {accountActivation.modal_header}
                    </Modal.Header>
                    <Modal.Content>
                      {accountActivation.modal_body}
                    </Modal.Content>
                    <Modal.Actions>
                      <Button
                        loading={accountActivation.isFetching}
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
                  src="/images/undraw_monitor_iqpq.svg"
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

export default ActivationPage
