import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface QueryProviderProps {
    children?: React.ReactNode
}

const queryClient = new QueryClient()

export default function QueryProvider(props: QueryProviderProps) {
    return (
        <QueryClientProvider client={queryClient}>
            {props.children}
        </QueryClientProvider>
    )
}
