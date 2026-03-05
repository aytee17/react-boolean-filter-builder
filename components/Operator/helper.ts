function translateOperator(operator: string): string {
  switch (operator) {
    case "and":
      return "all"
    case "or":
      return "any"
    default:
      return operator
  }
}

export { translateOperator }
