import React, { Fragment, useEffect, useState } from "react"
import Navbar from "sections/global/Navbar"
import Footer from "sections/global/Footer"
import { useDispatch, useSelector } from "react-redux"
import {
  selectMyApplications,
  getMyApplcations,
} from "features/my-applications"
import querystring from "querystring"
import {
  Placeholder,
  Segment,
  Modal,
  Button,
  Icon,
  Table,
  Pagination,
  Divider,
  Header,
  Label,
  PaginationProps,
  Container,
} from "semantic-ui-react"
import ErrorMessage from "sections/global/ErrorMessage"
import NoResults from "sections/global/NoResults"
import { properCaseTransform, dateDiffString } from "utils/date"
import { useHistory, useLocation } from "react-router-dom"
import BannerGroup from "sections/global/BannerGroup"
import VerticallyPaddedContainer from "sections/global/VerticallyPaddedContainer"
import {
  updateApplication,
  reset,
  selectApplicationUpdate,
} from "features/job-application-update"

interface IProps {}

const MyApplicationsPage: React.FC<IProps> = () => {
  const dispatch = useDispatch()
  const selectUpdate = useSelector(selectApplicationUpdate)
  const selectApplications = useSelector(selectMyApplications)
  const locationSelector = useLocation()
  const [actionModal, setActionModal] = useState<boolean>(false)
  const [focusItem, setItem] = useState<IMyApplcation | null>(null)

  useEffect(() => {
    const { search } = locationSelector
    const query = querystring.parse(locationSelector.search.substring(1))
    if (search.length > 0 && query.page) {
      dispatch(getMyApplcations({ page: query.page as string }))
    } else {
      dispatch(getMyApplcations({ page: "1" }))
    }
  }, [dispatch, locationSelector])

  const historySelector = useHistory()
  const handlePageChange = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    data: PaginationProps
  ) => {
    let queryObject = querystring.parse(
      historySelector.location.search.substring(1)
    )
    queryObject.page = data.activePage as string

    let queryString = querystring.stringify(queryObject)
    historySelector.push({
      pathname: "/my-applications",
      search: `?${queryString}`,
    })
  }

  const handleJobView = (slug: string) => {
    historySelector.push({
      pathname: `/job/${slug}`,
    })
  }

  const handleWithdrawal = () => {
    setActionModal(false)
    if (focusItem) {
      dispatch(
        updateApplication({
          job_id: focusItem?.job_id._id,
          status: "withdrawn",
        })
      )
    }
  }
  return (
    <Fragment>
      <Navbar />

      <Segment basic>
        <Container>
          <VerticallyPaddedContainer size="4">
            <Header as="h1" content="Your applications" />
            <Divider />

            {selectApplications.isFetching ? (
              <Segment padded stacked>
                <Placeholder fluid>
                  <Placeholder.Paragraph>
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                  </Placeholder.Paragraph>
                </Placeholder>
              </Segment>
            ) : selectApplications.error ? (
              <ErrorMessage
                header="An error occured"
                content={selectApplications.error}
              />
            ) : selectApplications.myApplications ? (
              <Fragment>
                <Table striped celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell content="Title" />
                      <Table.HeaderCell content="Company" />
                      <Table.HeaderCell content="Status" />
                      <Table.HeaderCell content="Applied on" />
                      <Table.HeaderCell content="Actions" colSpan="2" />
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {selectApplications.myApplications.results.docs.map(
                      (item) => {
                        const { status, createdAt } = item
                        return (
                          <Table.Row>
                            <Table.Cell>
                              {properCaseTransform(item.job_id.title)}
                            </Table.Cell>
                            <Table.Cell>
                              <Label>{item.job_id.company_name}</Label>
                            </Table.Cell>
                            <Table.Cell>
                              <Label>{status}</Label>
                            </Table.Cell>
                            <Table.Cell>{dateDiffString(createdAt)}</Table.Cell>
                            <Table.Cell>
                              <Button.Group size="tiny">
                                <Button
                                  disabled={status !== "pending" ? true : false}
                                  onClick={() => {
                                    setItem(item)
                                    setActionModal(true)
                                  }}
                                  color="red"
                                  content="Withdraw"
                                />
                                <Button.Or />
                                <Button
                                  content="View job"
                                  color="green"
                                  onClick={() =>
                                    handleJobView(item.job_id.slug)
                                  }
                                />
                              </Button.Group>
                            </Table.Cell>
                          </Table.Row>
                        )
                      }
                    )}
                  </Table.Body>
                </Table>
                <Pagination
                  activePage={selectApplications.myApplications.results.page}
                  firstItem={{
                    content: <Icon name="angle double left" />,
                    icon: true,
                  }}
                  lastItem={{
                    content: <Icon name="angle double right" />,
                    icon: true,
                  }}
                  prevItem={{
                    content: <Icon name="angle left" />,
                    icon: true,
                  }}
                  nextItem={{
                    content: <Icon name="angle right" />,
                    icon: true,
                  }}
                  totalPages={
                    selectApplications.myApplications?.results.totalPages
                  }
                  onPageChange={handlePageChange}
                />
              </Fragment>
            ) : selectApplications.myApplications ? (
              <NoResults
                header="No results"
                content="Try applying for some jobs to view your applications."
              />
            ) : null}

            <Modal open={actionModal} dimmer="blurring">
              <Modal.Header>Withdrawal confirmation</Modal.Header>
              <Modal.Content>
                Are you sure you want to withdraw from your application?
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={() => {}} color="green">
                  Yes
                </Button>
                <Button color="red" onClick={() => setActionModal(false)}>
                  No
                </Button>
              </Modal.Actions>
            </Modal>

            <Modal
              open={selectUpdate.modal_header.length > 0}
              dimmer="blurring"
              onClose={() => dispatch(reset())}
            >
              <Modal.Header>{selectUpdate.modal_header}</Modal.Header>
              <Modal.Content>{selectUpdate.modal_body}</Modal.Content>
              <Modal.Actions>
                <Button onClick={() => dispatch(reset())} color="green">
                  Confirm
                </Button>
              </Modal.Actions>
            </Modal>
          </VerticallyPaddedContainer>
        </Container>
      </Segment>
      <BannerGroup showFeedback />

      <Footer />
    </Fragment>
  )
}

export default MyApplicationsPage
