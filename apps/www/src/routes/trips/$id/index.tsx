import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { IconMap, IconMessage } from '@tabler/icons-react'
import { getTripMessages } from './-components/actions'
import { exportTripPDF } from '@/lib/export-pdf'
import { ChatPanel } from '@/components/trip/chat-panel'
import { TripDisplay } from '@/components/trip/trip-display'

export const Route = createFileRoute('/trips/$id/')({
    loader: async ({ params }) => {
        const rows = await getTripMessages({ data: { tripId: params.id } })

        const initialMessages = rows.map((m) => ({
            id: m.id,
            role: m.role === 'function' ? 'assistant' : m.role,
            parts: [{ type: 'text', text: m.content }],
        }))

        return { initialMessages }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { id: tripId } = Route.useParams()
    const { initialMessages } = Route.useLoaderData()
    const [mobileView, setMobileView] = useState<'chat' | 'trip'>('chat')
    const didAutoContinueRef = useRef<string | null>(null)

    const { messages, sendMessage, status, setMessages, regenerate } = useChat({
        id: tripId,
        messages: initialMessages as any,
        transport: new DefaultChatTransport({ api: '/api/chat' }),
    })

    useEffect(() => {
        if (didAutoContinueRef.current === tripId) return
        if (initialMessages.length === 0) return

        didAutoContinueRef.current = tripId
        setMessages(initialMessages as any)

        const hasAssistant = initialMessages.some(
            (m: any) => m.role === 'assistant',
        )
        const last = initialMessages.at(-1) as any
        if (!hasAssistant && last.role === 'user') {
            setTimeout(() => {
                regenerate({ messageId: last.id }).catch(() => {})
            }, 0)
        }
    }, [initialMessages, regenerate, setMessages, tripId])

    const hasTripData = messages.some((m) =>
        m.parts.some(
            (p) =>
                p.type.startsWith('tool-') &&
                'state' in p &&
                p.state === 'output-available',
        ),
    )

    const handleSendMessage = (text: string) => {
        sendMessage({ text })
    }

    const handleExportPDF = () => {
        exportTripPDF(messages)
    }

    return (
        <main className="bg-background flex h-dvh flex-col">
            {/* Mobile toggle */}
            {hasTripData && (
                <div className="bg-card flex items-center border-b p-2 lg:hidden">
                    <button
                        onClick={() => setMobileView('chat')}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            mobileView === 'chat'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground'
                        }`}
                    >
                        <IconMessage className="size-4" />
                        Chat
                    </button>
                    <button
                        onClick={() => setMobileView('trip')}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            mobileView === 'trip'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground'
                        }`}
                    >
                        <IconMap className="size-4" />
                        Trip Plan
                    </button>
                </div>
            )}

            {/* Desktop layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Chat panel */}
                <div
                    className={`flex-shrink-0 border-r ${
                        hasTripData ? 'w-full lg:w-[420px]' : 'w-full'
                    } ${hasTripData && mobileView !== 'chat' ? 'hidden lg:flex' : 'flex'} flex-col`}
                >
                    <ChatPanel
                        messages={messages}
                        status={status}
                        onSendMessage={handleSendMessage}
                    />
                </div>

                {/* Trip display panel */}
                {hasTripData && (
                    <div
                        className={`flex-1 ${
                            mobileView !== 'trip' ? 'hidden lg:flex' : 'flex'
                        } flex-col overflow-hidden`}
                    >
                        <TripDisplay
                            messages={messages}
                            onExportPDF={handleExportPDF}
                        />
                    </div>
                )}
            </div>
        </main>
    )
}
