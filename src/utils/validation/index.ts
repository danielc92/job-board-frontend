export const GLOBAL_TEXT_LIMITS = {
  POST_CONTACT_SUMMARY: 500,
  POST_JOB_SUMMARY: 2000,
  POST_COMPANY_SUMMARY: 2000,
  POST_JOB_PREVIEW: 250,
  APPLICATION_COVER_LETTER: 2000,
}

export const ListValidator = (
  list: string[],
  minItems: number,
  maxItems: number,
  listTag: string
): string[] => {
  let errors = []
  const len = list.length

  if (len < minItems || len > maxItems) {
    errors.push(`${listTag} items must be between ${minItems} and ${maxItems}.`)
  }

  return errors
}

export const IsEmptyValidator = (string: string, tag: string): string[] => {
  let errors = []

  if (string.length === 0) {
    errors.push(`${tag} is required.`)
  }

  return errors
}

// Check illegal chars
// Check length
// Check each section is in range
// Check each section has correct day to month

export const DateValidator = (string: string, dateString: string): string[] => {
  let allowed = "/0987654321"
  let errors: string[] = []
  let uniqueChars = [...new Set(dateString.split(""))]

  for (let i = 0; i < uniqueChars.length; i++) {
    if (!allowed.includes(uniqueChars[i])) {
      return [
        `${string} has an invalid date format, please make sure you have day/month/year in this format.`,
      ]
    }
  }

  const split = dateString.split("/")

  if (split.length !== 3) {
    return [
      `${string} has an invalid date format, please make sure you have day/month/year in this format.`,
    ]
  }

  let dayString = split[0]
  let monthString = split[1]
  let yearString = split[2]

  let dayInteger = parseInt(dayString)
  let monthInteger = parseInt(monthString)
  let yearInteger = parseInt(yearString)

  if (dayInteger < 1 || dayInteger > 31 || dayString.length > 2) {
    return [`${string} has an invalid date format, please check the day.`]
  }

  if (monthInteger < 1 || monthInteger > 12 || monthString.length > 2) {
    return [`${string} has an invalid date format, please check the month.`]
  }

  if (
    yearInteger < 1930 ||
    yearInteger > new Date().getFullYear() ||
    yearString.length !== 4
  ) {
    return [`${string} has an invalid date format, please check the year.`]
  }

  return errors
}

export const SalaryRangeValidator = (
  lowerSalary: string,
  upperSalary: string
) => {
  let errors = []
  let lowerSalaryNum = Number(lowerSalary)
  let upperSalaryNum = Number(upperSalary)

  if (lowerSalaryNum > upperSalaryNum) {
    errors.push("Maximum salary must be greater than minimum salary")
  }

  return errors
}

export const StringValidator = (
  string: string,
  minLength: number,
  maxLength: number,
  tag: string
) => {
  let errors = []
  let trimmed = string.trim()
  let length = trimmed.length

  if (length > maxLength || length < minLength) {
    errors.push(
      `${tag} must be between ${minLength} and ${maxLength} characters long.`
    )
  }

  return errors
}

export const CharacterNumberValidator = (
  number: number,
  minLength: number,
  maxLength: number,
  tag: string
) => {
  let errors: string[] = []
  if (number > maxLength || number < minLength) {
    errors.push(
      `${tag} must be between ${minLength} and ${maxLength} characters long.`
    )
    return errors
  }
  return errors
}
export const StringCharacterValidator = (
  string: string,
  allowedChars: string,
  tag: string
): string[] => {
  let errors: string[] = []
  let string2 = string.toLowerCase().trim()
  let chars = string2.split("")
  for (let i = 0; i < chars.length; i++) {
    if (!allowedChars.includes(chars[i])) {
      errors.push(
        `${tag} cannot contain character '${chars[i]}'. Only characters from '${allowedChars}' are allowed.`
      )
      return errors
    }
  }
  return errors
}

export const EmailValidator = (
  string: string,
  minLength: number,
  maxLength: number
) => {
  let errors = []
  let trimmed = string.trim()
  let length = trimmed.length

  if (length > maxLength || length < minLength) {
    errors.push(
      `Email must be between ${minLength} and ${maxLength} characters long.`
    )
  }

  //REGEX SOURCE: https://emailregex.com/
  let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!re.test(trimmed)) {
    errors.push("Email must be valid.")
  }

  return errors
}

export const PasswordValidator = (
  string: string,
  minLength: number,
  maxLength: number,
  minUnique: number
): string[] => {
  let errors: string[] = []
  let trimmed = string.trim()
  let length = trimmed.length

  // Check Length
  if (length > maxLength || length < minLength) {
    errors.push(
      `Password must be between ${minLength} and ${maxLength} characters long.`
    )
  }

  // Check unique chars for user security
  let split = trimmed.split("")
  let unique_count = [...new Set(split)].length
  if (unique_count < minUnique) {
    errors.push(`Passwords must have at least ${minUnique} unique characters.`)
  }

  return errors
}

export const PasswordMatcher = (string: string, string2: string): string[] => {
  let errors: string[] = []

  if (string !== string2) {
    errors.push("Passwords must match.")
  }

  return errors
}
