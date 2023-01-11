import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { wrapper } from '../stores/store'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'

// function App({ Component, pageProps }: AppProps) {
//   return <Component {...pageProps} />
// }

// export default wrapper.withRedux(App)

export default function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest)
  const { pageProps } = props;
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <Toaster position="top-right"/>
    </Provider>
  ) 
}
