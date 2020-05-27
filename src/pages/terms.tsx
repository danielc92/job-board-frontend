import React, { useEffect, Fragment } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Container, Placeholder, Segment } from "semantic-ui-react"
import ErrorMessage from "sections/global/ErrorMessage"
import {
  selectDocumentation,
  getDocumentationList,
} from "features/documentation"
import VerticallyPaddedContainer from "sections/global/VerticallyPaddedContainer"
import { documentationRenderer } from "utils/render"
import Footer from "sections/global/Footer"
import BannerGroup from "sections/global/BannerGroup"
import Navbar from "sections/global/Navbar"

interface IProps {}

const TermsPage: React.FC<IProps> = () => {
  const dispatch = useDispatch()
  const documentation = useSelector(selectDocumentation)

  useEffect(() => {
    if (!documentation.documentation) {
      dispatch(getDocumentationList())
    }
  }, [dispatch, documentation.documentation])

  return (
    <Fragment>
      <Navbar />
      <Container text>
        <VerticallyPaddedContainer size="4">
          {documentation.error ? (
            <ErrorMessage
              header="Error"
              content="Something went wrong please try again later."
            />
          ) : documentation.isFetching ? (
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
                    <Placeholder.Line /> <Placeholder.Line />
                    <Placeholder.Line /> <Placeholder.Line />
                    <Placeholder.Line /> <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line /> <Placeholder.Line />
                    <Placeholder.Line /> <Placeholder.Line />
                    <Placeholder.Line /> <Placeholder.Line />
                    <Placeholder.Line /> <Placeholder.Line />
                    <Placeholder.Line /> <Placeholder.Line />
                  </Placeholder.Paragraph>
                </Placeholder>
              </Segment>
            </Fragment>
          ) : (
            documentationRenderer(
              documentation.documentation?.results,
              "terms-of-use"
            )
          )}
        </VerticallyPaddedContainer>
      </Container>
      <BannerGroup showFeedback />
      <Footer />
    </Fragment>
  )
}

export default TermsPage
