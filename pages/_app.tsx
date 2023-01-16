import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { store, wrapper } from '../stores/store'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import NextNProgress from 'nextjs-progressbar';

// function App({ Component, pageProps }: AppProps) {
//   return <Component {...pageProps} />
// }

// export default wrapper.withRedux(App)

export default function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest)
  const { pageProps } = props;
  return (
    <Provider store={store}>
      <NextNProgress color="rgb(88, 28, 135)" />
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </Provider>
  )
}
