import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps }) {
    return (
        <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
            <Analytics />
        </SessionProvider>
    );
}

export default MyApp;