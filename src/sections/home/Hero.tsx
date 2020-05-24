import React from "react"
import { Image, Grid, Segment, Container, Header } from "semantic-ui-react"
import VerticallyPaddedContainer from "sections/global/VerticallyPaddedContainer"

interface IProps {
  ctaHeader: string
  ctaSubHeader: string
  image: String
  left: boolean
}

const Hero: React.FC<IProps> = ({ ctaHeader, ctaSubHeader, image, left }) => {
  const imageStyle = { padding: "0.5rem", maxWidth: "400px" }
  const centerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }
  return (
    <Segment basic textAlign="center">
      <Container>
        <VerticallyPaddedContainer size="5">
          <Grid divided="vertically" stackable>
            <Grid.Row columns={2}>
              {left === true ? (
                <Grid.Column style={centerStyle}>
                  <Image src={image} style={imageStyle} />
                </Grid.Column>
              ) : null}
              <Grid.Column verticalAlign="middle" style={centerStyle}>
                <Header
                  as="h1"
                  style={{ fontSize: "3rem" }}
                  content={ctaHeader}
                />
                <p>{ctaSubHeader}</p>
              </Grid.Column>
              {left === false ? (
                <Grid.Column style={centerStyle}>
                  <Image src={image} style={imageStyle} />
                </Grid.Column>
              ) : null}
            </Grid.Row>
          </Grid>
        </VerticallyPaddedContainer>
      </Container>
    </Segment>
  )
}

export default Hero
