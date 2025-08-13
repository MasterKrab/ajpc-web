const getImage = async (url: string) => {
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')
  return `data:image/jpeg;base64,${base64}`
}

export default getImage
