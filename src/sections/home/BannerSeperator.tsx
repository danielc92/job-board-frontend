import React from "react"

interface IProps {
  fillColor: string
  backgroundColor: string
}

const BannerSeperator: React.FC<IProps> = ({ fillColor, backgroundColor }) => {
  return (
    <svg
      style={{
        height: "7vh",
        width: "100%",
        background: backgroundColor,
        position: "absolute",
        bottom: "0",
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <polygon fill={fillColor} points="0,100 100,0 100,100" />
    </svg>
  )
}

export default BannerSeperator
