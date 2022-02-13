import type { AppProps } from 'next/app'
import { GeistProvider, CssBaseline } from '@geist-ui/core'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { useState } from 'react'

export default ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <GeistProvider>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Component {...pageProps} />
        </Hydrate>
      </QueryClientProvider>
    </GeistProvider >
  )
}
