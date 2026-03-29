import { createServerFn } from '@tanstack/react-start'
import * as z from 'zod'
import puppeteer from 'puppeteer'
import type { Hotel } from '@/routes/api/chat/-components/tools/search-hotels'

const SearchHotelsInputSchema = z.object({
    query: z.string(),
    guests: z.number().default(2),
    checkInDate: z.date(),
    checkOutDate: z.date(),
})

export const searchHotels = createServerFn({ method: 'GET' })
    .inputValidator(SearchHotelsInputSchema)
    .handler(async ({ data }): Promise<Hotel> => {
        return scrapAgodaHotels(data)
    })

export const scrapAgodaHotels = async (
    data: z.infer<typeof SearchHotelsInputSchema>,
): Promise<Hotel> => {
    const browser = await puppeteer.launch({
        headless: false,
    })
    const page = await browser.newPage()

    await page.goto('https://www.agoda.com/')

    const searchInput = await page.waitForSelector(
        'input[aria-label="Enter a destination or property"]',
    )
    await searchInput?.type(data.query)

    await delay(1000)
    await page.mouse.click(10, 10)

    const searchButton = await page.waitForSelector(
        'button[data-element-name="search-button"]',
    )
    await searchButton?.click()
    await delay(1000)

    const hotelsPage = await browser.waitForTarget((target) =>
        target.url().includes('https://www.agoda.com/search'),
    )
    const hotelsPageInstance = await hotelsPage.page()
    await delay(5000)

    const hotelsRaw = await hotelsPageInstance?.$$(
        'li[data-selenium="hotel-item"]',
    )

    const hotels = []
    let count = 0
    for (const el of hotelsRaw ?? []) {
        if (count >= 1) break

        await el.evaluate((e) => e.scrollIntoView())

        const name = await el.$eval(
            'a[data-selenium="hotel-name"] > span, a[data-selenium="hotel-name"] > h3',
            (_el) => _el.textContent?.trim() || '',
        )

        const _price = await el.$eval(
            'div[data-element-name="final-price"] > span[data-selenium="display-price"]',
            (_el) => _el.textContent?.trim() || '',
        )
        const usdToThbRate = 1 // 32.49
        const price =
            (parseFloat(_price.replace(/[^0-9.]/g, '')) / usdToThbRate) *
            (data.guests / 2)
        // const currency = await el.$eval(
        //     'div[data-element-name="final-price"] > span[data-selenium="hotel-currency"]',
        //     (_el) => _el.textContent?.trim() || '',
        // )

        const amenitiesPool = [
            'Free WiFi',
            'Pool',
            'Spa',
            'Gym',
            'Restaurant',
            'Room Service',
            'Airport Shuttle',
            'Breakfast Included',
            'Rooftop Bar',
            'Concierge',
        ]
        const amenities = amenitiesPool
            .sort(() => 0.5 - Math.random())
            .slice(0, 4 + Math.floor(Math.random() * 3))

        hotels.push({
            name: name,
            rating: 4 + Math.random(),
            pricePerNight: price,
            location: data.query,
            amenities: amenities,
            checkIn: data.checkInDate.toISOString().split('T')[0],
            checkOut: data.checkOutDate.toISOString().split('T')[0],
            guests: data.guests,
            totalPrice:
                price *
                Math.ceil(
                    (data.checkOutDate.getTime() - data.checkInDate.getTime()) /
                        86400000,
                ),
        } as Hotel)
        count++
    }

    await browser.close()
    return hotels[0]
}

function delay(time: number) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    })
}
