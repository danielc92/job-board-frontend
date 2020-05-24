export const properCaseTransform = (string: string): string => {
  let split = string.split(" ")
  let items = split.map((item) => {
    let last = item[item.length - 1]
    let first = item[0]

    // Handles cases like (nsw) --> (NSW)
    if (first === "(" && last === ")") {
      return item.toUpperCase()
      // Else only capitalize first letter
    } else {
      return item.charAt(0).toUpperCase() + item.substr(1).toLowerCase()
    }
  })
  let newString = items.join(" ")
  return newString
}
