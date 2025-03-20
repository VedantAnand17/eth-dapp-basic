// Importing necessary libraries and hooks from `@tanstack/react-query` and `wagmi`
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // React Query for managing data fetching and caching
import { useAccount, useConnect, useConnectors, useDisconnect, useReadContract, WagmiProvider } from "wagmi"; // Wagmi for Ethereum wallet connection functionality
import "./App.css"; // Importing CSS file for styling
import { config } from "./config"; // Importing the Ethereum configuration
import { ABI } from "./abi";
import { Address } from "viem";
import { AllowUSDT } from "./AllowUSDT";

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
        <TotalSupply />
        <BalanceOf />
        <br />
        <br />
        <AllowUSDT />
      </QueryClientProvider>
    </WagmiProvider>
  )
}


function TotalSupply() {
  const { data, isLoading, error } = useReadContract({
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    abi: ABI,
    functionName: 'totalSupply',
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      Total Supply: {data?.toString()}
    </div>
  )
}

function BalanceOf() {
  const { address } = useAccount()

  // Check if address is available and valid


  const { data, isLoading, error } = useReadContract({
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    abi: ABI,
    functionName: 'balanceOf',
    args: [address?.toString() as Address],
  })

  if (isLoading) return <div>Loading...</div>
  if (error) {
    return (
      <div>
        Please connect your wallet
      </div>
    )
  }

  return (
    <div>
      Your USDT balance is: {data?.toString()}
    </div>
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
