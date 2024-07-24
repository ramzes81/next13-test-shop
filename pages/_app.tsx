import BasketContextProvider from "../features/basket/BasketContext";

export default function App({ Component, pageProps }) {
    return (
        <BasketContextProvider>
            <Component {...pageProps} />
        </BasketContextProvider>
    )
}