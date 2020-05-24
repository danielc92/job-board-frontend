import React from "react"

interface IProps {
  size: string
}

const sizes: { [key: string]: number } = {
  "0": 8,
  "1": 16,
  "2": 24,
  "3": 36,
  "4": 48,
  "5": 80,
  "6": 120,
  "7": 150,
  "8": 200,
}
const VerticallyPaddedContainer: React.FC<IProps> = ({ children, size }) => {
  const style = {
    padding: `${sizes[size]}px 0px`,
  }
  return <section style={style}>{children}</section>
}

export default VerticallyPaddedContainer
