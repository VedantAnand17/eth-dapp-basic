import { http, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'


export const config = createConfig({
    chains: [mainnet],
    connectors: [
        injected()
    ],
    transports: {
        [mainnet.id]: http(import.meta.env.REACT_APP_ALCHEMY_ID),
    },
})