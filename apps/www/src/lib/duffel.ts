import { Duffel } from '@duffel/api'

export const duffel = new Duffel({
    token: process.env.DUFFEL_API_KEY!,
    // debug: { verbose: true },
})

export const isDuffelTestMode =
    process.env.DUFFEL_API_KEY?.includes('test_') ?? false
