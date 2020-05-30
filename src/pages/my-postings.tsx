import React, { Fragment, useEffect, useState } from "react"
import Navbar from "sections/global/Navbar"
import Footer from "sections/global/Footer"
import BannerGroup from "sections/global/BannerGroup"
import NoResults from "sections/global/NoResults"
import querystring from "querystring"
import {
  Divider,
  Header,
  Table,
  Button,
  Icon,
  Pagination,
  Modal,
  Placeholder,
  Segment,
  PaginationProps,
  Container,
} from "semantic-ui-react"
import ErrorMessage from "sections/global/ErrorMessage"
import { properCaseTransform, dateDiffString } from "utils/date"
import { useDispatch, useSelector } from "react-redux"
import { selectMyPostings, getMyPostings } from "features/my-postings"
import { useLocation, useHistory } from "react-router-dom"
import VerticallyPaddedContainer from "sections/global/VerticallyPaddedContainer"
import { updateApplication } from "features/job-application-update"
import {
  updateJobStatus,
  selectJobStatusUpdate,
  reset,
} from "features/job-status-update"

interface IProps {}

const MyPostingsPage: React.FC<IProps> = () => {
  const dispatch = useDispatch()
  const jobUpdate = useSelector(selectJobStatusUpdate)
  const locationSelector = useLocation()
  const historySelector = useHistory()
  const myPostings = useSelector(selectMyPostings)
  const [actionModal, setActionModal] = useState<boolean>(false)
  const [selectedJobPost, setJobPost] = useState<IMyPost | null>(null)

  useEffect(() => {
    const { search } = locationSelector
    const query = querystring.parse(locationSelector.search.substring(1))
    if (search.length > 0 && query.page) {
      dispatch(getMyPostings({ page: query.page as string }))
    } else {
      dispatch(getMyPostings({ page: "1" }))
    }
  }, [dispatch, locationSelector])

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
      pathname: "/my-postings",
      search: `?${queryString}`,
    })
  }
  const handleNavigateApplications = (job_id: string) => {
    historySelector.push({
      pathname: `/my-postings/${job_id}`,
    })
  }

  return (
    <Fragment>
      <Navbar />
      <Segment basic>
        <Container>
          <VerticallyPaddedContainer size="4">
            <Header as="h1" content="My Job Postings" />
            <Divider />

            {myPostings.isFetching ? (
              <Segment stacked padded>
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
                  </Placeholder.Paragraph>
                </Placeholder>
              </Segment>
            ) : myPostings.error ? (
              <ErrorMessage
                header="An error has occured"
                content={myPostings.error}
              />
            ) : myPostings.myPostings &&
              myPostings.myPostings?.results.totalDocs > 0 ? (
              <Fragment>
                <Table striped celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell content="Title" />
                      <Table.HeaderCell content="Status" />
                      <Table.HeaderCell content="Created" />
                      <Table.HeaderCell content="Actions" colSpan="2" />
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {myPostings.myPostings?.results.docs.map((item) => (
                      <Table.Row>
                        <Table.Cell>
                          <Header>
                            <Header.Content>
                              {properCaseTransform(item.title)}
                              <Header.Subheader>
                                {item.job_summary.substring(0, 50)}
                              </Header.Subheader>
                            </Header.Content>
                          </Header>
                        </Table.Cell>
                        <Table.Cell
                          negative={item.open ? false : true}
                          positive={item.open ? true : false}
                        >
                          {item.open === true ? "open" : "closed"}
                        </Table.Cell>
                        <Table.Cell>
                          {dateDiffString(item.createdAt)}
                        </Table.Cell>
                        <Table.Cell>
                          <Button.Group size="tiny">
                            <Button
                              content="View applications"
                              color="green"
                              onClick={() =>
                                handleNavigateApplications(item._id)
                              }
                            />
                            <Button.Or />
                            <Button
                              disabled={!item.open}
                              content="Close job"
                              color="red"
                              onClick={
                                () => {
                                  setJobPost(item)
                                  setActionModal(true)
                                }
                                //   handleCloseJob({
                                //     job_id: item._id,
                                //     creator_id: auth.user._id,
                                //   })
                              }
                            />
                          </Button.Group>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
                <Pagination
                  activePage={myPostings.myPostings.results.page}
                  ellipsisItem={{
                    content: <Icon name="ellipsis horizontal" />,
                    icon: true,
                  }}
                  firstItem={{
                    content: <Icon name="angle double left" />,
                    icon: true,
                  }}
                  lastItem={{
                    content: <Icon name="angle double right" />,
                    icon: true,
                  }}
                  prevItem={{ content: <Icon name="angle left" />, icon: true }}
                  nextItem={{
                    content: <Icon name="angle right" />,
                    icon: true,
                  }}
                  totalPages={myPostings.myPostings.results.totalPages}
                  onPageChange={handlePageChange}
                />
              </Fragment>
            ) : myPostings.myPostings?.results.docs &&
              myPostings.myPostings?.results.docs.length === 0 ? (
              <NoResults
                header="No results"
                content="It looks like you have not posted any jobs so far."
              />
            ) : null}

            <Modal open={actionModal}>
              <Modal.Header>Close confirmation</Modal.Header>
              <Modal.Content>
                Are you sure you want to close this job? This action cannot be
                undone.
              </Modal.Content>
              <Modal.Actions>
                <Button
                  loading={jobUpdate.isFetching}
                  onClick={() => {
                    if (selectedJobPost) {
                      dispatch(updateJobStatus({ job_id: selectedJobPost._id }))
                    }
                    setActionModal(false)
                  }}
                  color="green"
                >
                  Yes
                </Button>
                <Button onClick={() => setActionModal(false)} color="green">
                  No
                </Button>
              </Modal.Actions>
            </Modal>

            <Modal open={jobUpdate.modal_body.length > 0}>
              <Modal.Header>{jobUpdate.modal_header}</Modal.Header>
              <Modal.Content>{jobUpdate.modal_body}</Modal.Content>
              <Modal.Actions>
                <Button
                  loading={jobUpdate.isFetching}
                  onClick={() => {
                    dispatch(reset())
                  }}
                  color="green"
                >
                  Ok
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
export default MyPostingsPage
