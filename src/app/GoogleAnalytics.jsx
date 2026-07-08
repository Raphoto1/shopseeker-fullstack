'use client'

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Script from "next/script"
import * as gtag from "../gtag.js"

const GoogleAnalytics = () => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const trackingId = gtag.GA_TRACKING_ID

    //You can show in the console the GA_TRACKING_ID to confirm
    // console.log(gtag.GA_TRACKING_ID)

    useEffect(() => {
        if (!trackingId || !pathname) return

        const queryString = searchParams?.toString()
        const url = queryString ? `${pathname}?${queryString}` : pathname
        gtag.pageview(url)
    }, [pathname, searchParams, trackingId])

    if (!trackingId) {
        return null
    }

    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
            />
            <Script
                id="gtag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                                            gtag('config', '${trackingId}', {
                                            send_page_view: false,
                                            anonymize_ip: true,
                      });
                    `,
                }}
            />
        </>
    )
}

export default GoogleAnalytics