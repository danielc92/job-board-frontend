import React from "react"
import { Message } from "semantic-ui-react"

interface IProps {
  message: string
}

const ImportantAlert: React.FC<IProps> = ({ message }) => {
  return (
    <Message
      style={{ textAlign: "center", borderRadius: "0", margin: "0" }}
      color="green"
    >
      This website is currently in open beta phase.
    </Message>
  )
}

export default ImportantAlert
