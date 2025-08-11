import type { APIRoute } from 'astro'

import chromium from 'chrome-aws-lambda'
import puppeteer from 'puppeteer-core'
import type { Browser } from 'puppeteer-core'

const ACCOUNT_NAME = 'ajprogcomp'

const PAGE_URL = `https://www.instagram.com`

const getImageBase64 = async (url: string) => {
  const imageBase64 = await fetch(url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      return `data:image/jpeg;base64,${Buffer.from(buffer).toString('base64')}`
    })

  return imageBase64
}

let browser: Browser | null = null

const getProfile = async (take = 1) => {
  if (!browser) {
    browser = await puppeteer.launch({
      args: chromium.args,
      // @ts-ignore
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      // @ts-ignore
      headless: chromium.headless,
      // @ts-ignore
      ignoreHTTPSErrors: true,
    })
  }

  const page = await browser.newPage()

  try {
    await page.goto(
      `${PAGE_URL}/accounts/login/?next=%2Flogin%2F&source=desktop_nav`,
      {
        waitUntil: 'networkidle2',
      },
    )

    await page.type(
      'input[name="username"]',
      import.meta.env.INSTAGRAM_USERNAME,
    )

    await page.type(
      'input[name="password"]',
      import.meta.env.INSTAGRAM_PASSWORD,
    )

    await page.click('button[type="submit"]')

    await page.waitForNavigation({
      waitUntil: 'networkidle2',
    })

    await page.goto(`${PAGE_URL}/${ACCOUNT_NAME}`, {
      waitUntil: 'networkidle2',
    })

    const profileImageURL = await page.$eval('img', (img) =>
      img.getAttribute('src'),
    )
    const profileImageBase64 = await getImageBase64(profileImageURL!)

    const links = await page.$$eval('a', (as) => as.map((a) => a.href))

    const postsIds = links
      .filter((link) => link.startsWith(`${PAGE_URL}/${ACCOUNT_NAME}/p/`))
      .map((link) => link.split('/')[5])
      .slice(0, take)

    const posts = await Promise.all(
      postsIds.map(async (id) => {
        try {
          const page = await browser!.newPage()

          await page.goto(`${PAGE_URL}/${ACCOUNT_NAME}/p/${id}`, {
            waitUntil: 'networkidle2',
          })

          const imageURL = await page.$eval(
            'img.x5yr21d.xu96u03.x10l6tqk.x13vifvy.x87ps6o.xh8yej3',
            (image) => image.getAttribute('src'),
          )

          const imageBase64 = await getImageBase64(imageURL!)

          const contentText = await page.$eval(
            'span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1i0vuye.xvs91rp.xo1l8bm.x1o7cslx.x126k92a',
            (span) => span.textContent,
          )

          return {
            id,
            url: `${PAGE_URL}/${ACCOUNT_NAME}/p/${id}`,
            image: imageBase64,
            contentText,
          }
        } catch (error) {
          console.error(error)
        }
      }),
    )

    return {
      accountName: ACCOUNT_NAME,
      profileImage: profileImageBase64,
      posts,
    }
  } catch (error) {
    console.error(error)
  }
}

const CACHE_TIME = 1000 * 60 * 60 * 5 // 5 hours

let profileCached: {
  data: Awaited<ReturnType<typeof getProfile>> | null
  time: number
} = {
  data: null,
  time: 0,
}

const getCachedProfile = async () => {
  const now = Date.now()

  if (profileCached.data && now - profileCached.time < CACHE_TIME) {
    console.log(`${now.toLocaleString()} - Returning cached profile`)
    return profileCached.data
  }

  const profile = await getProfile()
  profileCached.data = profile
  profileCached.time = now

  console.log(`${now.toLocaleString()} - Caching new profile`)

  return profile
}

export const GET: APIRoute = async ({}) => {
  const profile = await getCachedProfile()

  return new Response(JSON.stringify(profile))
}
