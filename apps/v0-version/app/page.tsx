"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { ChatPanel } from "@/components/trip/chat-panel"
import { TripDisplay } from "@/components/trip/trip-display"
import { exportTripPDF } from "@/lib/export-pdf"
import { MessageSquare, Map } from "lucide-react"

export default function TravelPlannerPage() {
  const [mobileView, setMobileView] = useState<"chat" | "trip">("chat")

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const hasTripData = messages.some((m) =>
    m.parts.some(
      (p) =>
        p.type.startsWith("tool-") &&
        "state" in p &&
        p.state === "output-available"
    )
  )

  const handleSendMessage = (text: string) => {
    sendMessage({ text })
  }

  const handleExportPDF = () => {
    exportTripPDF(messages)
  }

  return (
    <main className="flex h-dvh flex-col bg-background">
      {/* Mobile toggle */}
      {hasTripData && (
        <div className="flex items-center border-b bg-card p-2 lg:hidden">
          <button
            onClick={() => setMobileView("chat")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              mobileView === "chat"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            }`}
          >
            <MessageSquare className="size-4" />
            Chat
          </button>
          <button
            onClick={() => setMobileView("trip")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              mobileView === "trip"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            }`}
          >
            <Map className="size-4" />
            Trip Plan
          </button>
        </div>
      )}

      {/* Desktop layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat panel */}
        <div
          className={`flex-shrink-0 border-r ${
            hasTripData ? "w-full lg:w-[420px]" : "w-full"
          } ${hasTripData && mobileView !== "chat" ? "hidden lg:flex" : "flex"} flex-col`}
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
              mobileView !== "trip" ? "hidden lg:flex" : "flex"
            } flex-col overflow-hidden`}
          >
            <TripDisplay messages={messages} onExportPDF={handleExportPDF} />
          </div>
        )}
      </div>
    </main>
  )
}
