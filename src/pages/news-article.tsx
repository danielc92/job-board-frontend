import React, { Fragment, useEffect } from "react"

import {
  Container,
  Segment,
  Label,
  Header,
  Placeholder,
  Divider,
  Icon,
} from "semantic-ui-react"

import { useParams } from "react-router-dom"
import BannerGroup from "sections/global/BannerGroup"
import { useDispatch, useSelector } from "react-redux"
import { selectNewsArticle, getNewsArticle } from "features/news-article"
import Footer from "sections/global/Footer"
import VerticallyPaddedContainer from "sections/global/VerticallyPaddedContainer"
import Navbar from "sections/global/Navbar"
import { contentRenderer } from "utils/render"
import ErrorMessage from "sections/global/ErrorMessage"
import { dateDiffString } from "utils/date"

const NewsArticlePage: React.FC = () => {
  const dispatch = useDispatch()
  const newsArticle = useSelector(selectNewsArticle)
  const params = useParams<{ slug: string }>()

  useEffect(() => {
    const { slug } = params
    if (slug) {
      dispatch(getNewsArticle(slug))
    }
  }, [dispatch, params])

  return (
    <Fragment>
      <Navbar />
      <Container text>
        <VerticallyPaddedContainer size="4">
          {newsArticle.error ? (
            <Fragment>
              <Header as="h2" content="News Article Page" />
              <Divider />
              <ErrorMessage
                header="An error has occurred"
                content={newsArticle.error}
              />
            </Fragment>
          ) : newsArticle.isFetching ? (
            <Fragment>
              <Placeholder fluid>
                <Placeholder.Header>
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder.Header>
              </Placeholder>

              <Segment stacked padded>
                <Placeholder fluid>
                  <Placeholder.Paragraph>
                    <Placeholder.Line /> <Placeholder.Line />{" "}
                    <Placeholder.Line /> <Placeholder.Line />{" "}
                    <Placeholder.Line /> <Placeholder.Line />{" "}
                    <Placeholder.Line />
                    <Placeholder.Line /> <Placeholder.Line />{" "}
                    <Placeholder.Line /> <Placeholder.Line />
                    <Placeholder.Line /> <Placeholder.Line />{" "}
                    <Placeholder.Line /> <Placeholder.Line />{" "}
                    <Placeholder.Line /> <Placeholder.Line />
                  </Placeholder.Paragraph>
                </Placeholder>
              </Segment>
            </Fragment>
          ) : newsArticle.news ? (
            <Fragment>
              <Header as="h2" content={newsArticle.news.results.title} />
              <Divider />
              <Segment stacked padded>
                {contentRenderer(newsArticle.news.results.content as any)}
                <Divider />
                <Label.Group>
                  <Label>
                    <Icon name="clock" />
                    Posted{" "}
                    {dateDiffString(
                      newsArticle.news.results.createdAt as string
                    )}
                  </Label>
                  <Label color="violet">
                    <Icon name="tag" />
                    {newsArticle.news.results.category}
                  </Label>
                </Label.Group>
              </Segment>
            </Fragment>
          ) : null}
        </VerticallyPaddedContainer>
      </Container>
      <BannerGroup showFeedback />
      <Footer />
    </Fragment>
  )
}

export default NewsArticlePage
