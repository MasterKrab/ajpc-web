export interface Data {
  username: string
  profileURL: string
  post: {
    url: string
    caption: string
    id: string
  }
}

export const getData = async (username: string): Promise<Data | null> => {
  try {
    const response = await fetch(
      `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
      {
        headers: {
          Accept: '*/*',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'x-ig-app-id': '936619743392459',
          'Sec-Fetch-Site': 'same-origin',
        },
      },
    )

    const { data } = await response.json()

    const post = data?.user?.edge_owner_to_timeline_media.edges[0].node

    return {
      username,
      profileURL: data?.user?.profile_pic_url,
      post: {
        url: post.display_url as string,
        caption: post.edge_media_to_caption.edges[0]?.node.text as string,
        id: post.shortcode as string,
      },
    }
  } catch (error) {
    console.error('Error fetching Instagram data:', error)
    return null
  }
}
