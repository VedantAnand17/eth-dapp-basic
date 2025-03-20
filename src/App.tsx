// Importing necessary libraries and hooks from `@tanstack/react-query` and `wagmi`
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // React Query for managing data fetching and caching
import { useAccount, useConnect, useConnectors, useDisconnect, WagmiProvider } from "wagmi"; // Wagmi for Ethereum wallet connection functionality
import "./App.css"; // Importing CSS file for styling
import { config } from "./config"; // Importing the Ethereum configuration

// Creating a new instance of QueryClient for React Query
const client = new QueryClient();

function App() {
  return (
    // Providing Ethereum connection context via WagmiProvider with the given configuration
    <WagmiProvider config={config}>
      {/* Wrapping the app with React Query's QueryClientProvider to provide the QueryClient instance to the whole app */}
      <QueryClientProvider client={client}>
        {/* Rendering the ConnectWallet component for wallet connection */}
        <ConnectWallet />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

// Component to handle Ethereum wallet connection logic
function ConnectWallet() {
  // Hook to get the connected account's address from Wagmi
  const { address } = useAccount()
  // Hook to get all available connectors (wallet options)
  const connectors = useConnectors()
  // Hook to handle wallet disconnect functionality
  const { disconnect } = useDisconnect()
  // Hook to handle wallet connect functionality
  const { connect } = useConnect()

  // If the user is already connected with an address, show the address and a disconnect button
  if (address) {
    return (
      <div>
        {/* Displaying the connected address */}
        <div>You are already connected with address: {address}</div>
        {/* Button to disconnect the wallet */}
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    )
  }

  // If the user is not connected, show available connectors (wallets to connect with)
  return connectors.map((connector) => (
    // Button for each connector to initiate the connection
    <button onClick={() => connect({ connector: connector })}>
      Connect via {connector.name} {/* Displaying the wallet name */}
    </button>
  ))
}

export default App; // Exporting the App component to be used elsewhere
