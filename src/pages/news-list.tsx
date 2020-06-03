import React, { useEffect, Fragment } from "react"
import {
  Segment,
  Placeholder,
  Icon,
  Label,
  Pagination,
  Button,
  Divider,
  Header,
  Container,
  PaginationProps,
} from "semantic-ui-react"
import querystring from "querystring"
import { useHistory, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getNewsList, selectNewsList } from "features/news-list"
import VerticallyPaddedContainer from "sections/global/VerticallyPaddedContainer"
import ErrorMessage from "sections/global/ErrorMessage"
import { dateDiffString } from "utils/date"
import Navbar from "sections/global/Navbar"
import Footer from "sections/global/Footer"
import BannerGroup from "sections/global/BannerGroup"
import { ROUTES } from "settings"

interface IProps {}

const NewsListPage: React.FC<IProps> = () => {
  const historySelector = useHistory()
  const locationSelector = useLocation()
  const newsList = useSelector(selectNewsList)
  const dispatch = useDispatch()

  useEffect(() => {
    const { search } = locationSelector
    if (search.length > 0) {
      const query = querystring.parse(locationSelector.search.substring(1))
      dispatch(getNewsList(query))
    } else {
      dispatch(getNewsList({ page: "1" }))
    }

    console.log(historySelector, locationSelector)
  }, [dispatch, historySelector, locationSelector])

  const handleViewNewsArticle = (slug: string) => {
    historySelector.push({
      pathname: `/news/${slug}`,
    })
  }

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
      pathname: ROUTES.NEWS_LIST,
      search: `?${queryString}`,
    })
  }

  return (
    <div>
      <Navbar />
      <Segment basic>
        <Container text>
          <VerticallyPaddedContainer size="4">
            <Header as="h1" content="News" />
            <p>Read about the latest updates and progress.</p>
            <Divider />
            {newsList.error ? (
              <ErrorMessage
                header="An error occurred"
                content={newsList.error}
              />
            ) : newsList.news?.results.docs ? (
              <Fragment>
                {newsList.news?.results.docs.map((item) => (
                  <Segment key={item._id} stacked padded>
                    <Header as="h3" content={item.title} />

                    <p>{item.summary}</p>
                    <Button
                      compact
                      color="green"
                      onClick={() => handleViewNewsArticle(item.slug)}
                    >
                      <Icon name="eye" />
                      Read more
                    </Button>
                    <Divider />
                    <Label.Group>
                      <Label
                        icon="clock"
                        size="tiny"
                        content={`Posted ${dateDiffString(item.createdAt)}`}
                      />
                      <Label
                        icon="tag"
                        color="violet"
                        size="tiny"
                        content={item.category}
                      />
                    </Label.Group>
                  </Segment>
                ))}
                <Pagination
                  activePage={newsList.news?.results.page}
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
                  totalPages={newsList.news?.results.totalPages}
                  onPageChange={handlePageChange}
                />
              </Fragment>
            ) : (
              <Fragment>
                {new Array(5).fill(true).map((x) => (
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
                      </Placeholder.Paragraph>
                    </Placeholder>
                  </Segment>
                ))}
              </Fragment>
            )}
          </VerticallyPaddedContainer>
        </Container>
      </Segment>
      <BannerGroup showFeedback />
      <Footer />
    </div>
  )
}

export default NewsListPage
