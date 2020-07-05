import {
  Header,
  Image,
  Segment,
  Divider,
  DropdownItemProps,
} from "semantic-ui-react"
import React, { Fragment } from "react"

const NODES = {
  HEADING_1: "heading-1",
  HEADING_2: "heading-2",
  HEADING_3: "heading-3",
  HEADING_4: "heading-4",
  HEADING_5: "heading-5",
  HEADING_6: "heading-6",
  PARAGRAPH: "paragraph",
  UNORDERED_LIST: "unordered-list",
  ORDERED_LIST: "ordered-list",
  IMAGE: "image",
}

const spaceBottom = { marginBottom: "24px" }
export const contentRenderer = (
  data: { node: string; value: string | Array<string> }[]
) => {
  if (!data) return null

  const items = data.map((item) => {
    const { node, value } = item
    switch (node) {
      case NODES.HEADING_1:
        return <Header style={spaceBottom} as="h1" content={value} />
      case NODES.HEADING_2:
        return <Header style={spaceBottom} as="h2" content={value} />
      case NODES.HEADING_3:
        return <Header style={spaceBottom} as="h3" content={value} />
      case NODES.HEADING_4:
        return <Header style={spaceBottom} as="h4" content={value} />
      case NODES.HEADING_5:
        return <Header style={spaceBottom} as="h5" content={value} />
      case NODES.HEADING_6:
        return <Header style={spaceBottom} as="h6" content={value} />
      case NODES.PARAGRAPH:
        return <p style={spaceBottom}>{value}</p>
      case NODES.IMAGE:
        return <Image style={spaceBottom} src={value} size="large" />
      case NODES.UNORDERED_LIST:
        let uListItems = (value as any).map((li: string) => <li>{li}</li>)
        return <ul style={spaceBottom}>{uListItems}</ul>
      case NODES.ORDERED_LIST:
        let oListItems = (value as any).map((li: string) => <li>{li}</li>)
        return <ol style={spaceBottom}>{oListItems}</ol>
      default:
        return <p>UNKNOWN NODE</p>
    }
  })

  return items
}

export const documentationRenderer = (data: any, key: string) => {
  if (!data) return null

  const content = data.find((c: any) => c.route === key)

  const items = contentRenderer(content.content)

  return (
    <Fragment>
      <Header as="h1" content={content.title} />
      <Divider />
      <Segment padded stacked>
        {items}
      </Segment>
    </Fragment>
  )
}

export const customRender = (item: DropdownItemProps) => ({
  color: "green",
  content: item.text,
})

export const renderQuillRichText = (item: string) => {
  // Remove all the <br> tags, as margins are already calculated on a tag level (p, h1, h2, h3 etc)
  return item.split("<p><br></p>").join("")
}
