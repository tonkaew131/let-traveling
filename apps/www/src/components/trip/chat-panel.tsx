import { useEffect, useRef, useState } from 'react'
import {
    Bot,
    Building2,
    CalendarDays,
    Cloud,
    Loader2,
    MapPin,
    Plane,
    Send,
    Sparkles,
    User,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { UIMessage } from 'ai'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ChatPanelProps {
    messages: Array<UIMessage>
    status: string
    onSendMessage: (text: string) => void
}

const toolLabels: Record<string, { label: string; icon: React.ReactNode }> = {
    searchFlights: {
        label: 'Searching flights...',
        icon: <Plane className="size-3.5" />,
    },
    searchHotels: {
        label: 'Finding hotels...',
        icon: <Building2 className="size-3.5" />,
    },
    getWeather: {
        label: 'Checking weather...',
        icon: <Cloud className="size-3.5" />,
    },
    createDayPlan: {
        label: 'Planning your day...',
        icon: <CalendarDays className="size-3.5" />,
    },
    generateTripSummary: {
        label: 'Creating summary...',
        icon: <MapPin className="size-3.5" />,
    },
}

const quickPrompts = [
    {
        label: 'Tokyo, 5 days',
        prompt: 'Plan a 5-day trip to Tokyo, Japan for 2 travelers. Budget around $3000. Departure from New York, traveling April 15-20, 2026.',
    },
    {
        label: 'Paris, 4 days',
        prompt: 'Plan a 4-day trip to Paris, France for 2 travelers. Budget around $2500. Departure from Los Angeles, traveling May 10-14, 2026.',
    },
    {
        label: 'Bali, 7 days',
        prompt: 'Plan a 7-day trip to Bali, Indonesia for 2 travelers. Budget around $2000. Departure from San Francisco, traveling June 1-8, 2026.',
    },
    {
        label: 'Rome, 3 days',
        prompt: 'Plan a 3-day trip to Rome, Italy for 1 traveler. Budget around $1500. Departure from Chicago, traveling March 20-23, 2026.',
    },
]

function getTextFromMessage(message: UIMessage): string {
    return message.parts
        .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
        .map((p) => p.text)
        .join('')
}

export function ChatPanel({ messages, status, onSendMessage }: ChatPanelProps) {
    const [input, setInput] = useState('')
    const scrollRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const isLoading = status === 'streaming' || status === 'submitted'

    useEffect(() => {
        if (scrollRef.current) {
            const viewport = scrollRef.current.querySelector(
                "[data-slot='scroll-area-viewport']",
            )
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight
            }
        }
    }, [messages])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return
        onSendMessage(input.trim())
        setInput('')
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    const hasMessages = messages.length > 0

    return (
        <div className="bg-card flex h-dvh min-h-0 flex-col">
            {/* Header */}
            <div className="border-b">
                <Link to="/">
                    <div className="flex w-fit items-center gap-3 px-4 py-3">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-9 shrink-0 rounded object-contain"
                        />
                        <div>
                            <h1 className="text-base font-bold text-[#516FA2]">
                                Let's Traveling
                            </h1>
                            <p className="text-muted-foreground text-xs">
                                Agentic Travel Planner
                            </p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Messages */}
            <ScrollArea ref={scrollRef} className="min-h-0 flex-1">
                {!hasMessages ? (
                    <div className="flex h-full flex-col items-center justify-center p-6">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="bg-primary/10 flex size-16 items-center justify-center rounded-2xl">
                                <Sparkles className="text-primary size-8" />
                            </div>
                            <div>
                                <h2 className="text-foreground text-lg font-bold">
                                    Plan your next adventure
                                </h2>
                                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                                    Tell me where you want to go, and I will
                                    plan flights, hotels, weather, and a
                                    day-by-day itinerary for you.
                                </p>
                            </div>
                            <div className="mt-2 grid w-full grid-cols-2 gap-2">
                                {quickPrompts.map((qp) => (
                                    <button
                                        key={qp.label}
                                        onClick={() => onSendMessage(qp.prompt)}
                                        className="bg-background hover:bg-muted rounded-xl border p-3 text-left transition-colors"
                                    >
                                        <span className="text-foreground text-sm font-medium">
                                            {qp.label}
                                        </span>
                                        <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                                            Click to plan this trip
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 p-4">
                        {messages.map((message) => {
                            const text = getTextFromMessage(message)
                            const toolParts = message.parts.filter(
                                (p) =>
                                    p.type.startsWith('tool-') && 'input' in p,
                            )
                            const isUser = message.role === 'user'

                            return (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                                >
                                    <div
                                        className={`flex size-7 shrink-0 items-center justify-center rounded-full ${isUser ? 'bg-foreground' : 'bg-primary'}`}
                                    >
                                        {isUser ? (
                                            <User className="text-background size-4" />
                                        ) : (
                                            <Bot className="text-primary-foreground size-4" />
                                        )}
                                    </div>
                                    <div
                                        className={`flex max-w-[85%] flex-col gap-2 ${isUser ? 'items-end' : ''}`}
                                    >
                                        {text && (
                                            <div
                                                className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                                    isUser
                                                        ? 'bg-primary text-primary-foreground rounded-br-md'
                                                        : 'bg-muted text-foreground rounded-bl-md'
                                                }`}
                                            >
                                                <div className="whitespace-pre-wrap">
                                                    {text}
                                                </div>
                                            </div>
                                        )}
                                        {/* Tool indicators */}
                                        {toolParts.map((part, i) => {
                                            const toolName = part.type.replace(
                                                'tool-',
                                                '',
                                            )
                                            const toolInfo =
                                                toolLabels[toolName]
                                            if (!toolInfo) return null
                                            const isComplete =
                                                'state' in part &&
                                                part.state ===
                                                    'output-available'
                                            return (
                                                <div
                                                    key={i}
                                                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
                                                        isComplete
                                                            ? 'border-primary/20 bg-primary/5 text-primary'
                                                            : 'border-border bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    {isComplete ? (
                                                        toolInfo.icon
                                                    ) : (
                                                        <Loader2 className="size-3.5 animate-spin" />
                                                    )}
                                                    <span>
                                                        {isComplete
                                                            ? toolInfo.label.replace(
                                                                  '...',
                                                                  ' - Done',
                                                              )
                                                            : toolInfo.label}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                        {isLoading &&
                            messages[messages.length - 1]?.role !==
                                'assistant' && (
                                <div className="flex gap-3">
                                    <div className="bg-primary flex size-7 shrink-0 items-center justify-center rounded-full">
                                        <Bot className="text-primary-foreground size-4" />
                                    </div>
                                    <div className="bg-muted flex items-center gap-2 rounded-2xl rounded-bl-md px-4 py-3">
                                        <Loader2 className="text-primary size-4 animate-spin" />
                                        <span className="text-muted-foreground text-sm">
                                            Planning your trip...
                                        </span>
                                    </div>
                                </div>
                            )}
                    </div>
                )}
            </ScrollArea>

            {/* Input */}
            <div className="bg-card border-t p-4">
                <form onSubmit={handleSubmit} className="relative">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            hasMessages
                                ? 'Ask to change your plans...'
                                : 'Where do you want to go?'
                        }
                        rows={1}
                        className="bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary/30 w-full resize-none rounded-xl border px-4 py-3 pr-12 text-sm focus:ring-2 focus:outline-none"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || !input.trim()}
                        className="absolute top-1/2 right-2 size-8 -translate-y-1/2 rounded-lg"
                    >
                        {isLoading ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <Send className="size-4" />
                        )}
                    </Button>
                </form>
                <p className="text-muted-foreground mt-2 text-center text-[10px]">
                    Let's Traveling may make mistakes. Always verify important
                    travel details.
                </p>
            </div>
        </div>
    )
}
