function pathToKey(path: Array<string | number>): string {
  return path.join(".")
}

function keyToPath(key: string): string[] {
  return key.split(".")
}

export { pathToKey, keyToPath }
