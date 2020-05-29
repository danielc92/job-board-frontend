import {
  Header,
  Image,
  Segment,
  Divider,
  DropdownItemProps,
} from "semantic-ui-react"
import React, { Fragment } from "react"

export const contentRenderer = (
  data: { node: string; value: string | Array<string> }[]
) => {
  if (!data) return null

  const items = data.map((c) => {
    if (c.node === "heading-3") {
      return (
        <Header style={{ marginBottom: "24px" }} as="h3" content={c.value} />
      )
    }
    if (c.node === "heading-1") {
      return (
        <Header style={{ marginBottom: "24px" }} as="h1" content={c.value} />
      )
    }
    if (c.node === "paragraph") {
      return <p style={{ marginBottom: "18px" }}>{c.value}</p>
    }
    if (c.node === "unordered-list") {
      const listItems = (c as any).value.map((li: string) => <li>{li}</li>)
      return <ul style={{ marginBottom: "24px" }}>{listItems}</ul>
    }
    if (c.node === "ordered-list") {
      const listItems = (c as any).value.map((li: string) => <li>{li}</li>)
      return <ol style={{ marginBottom: "24px" }}>{listItems}</ol>
    }
    if (c.node === "image") {
      return (
        <Image style={{ marginBottom: "24px" }} src={c.value} size="large" />
      )
    }
    return <p>Unknown node.</p>
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
