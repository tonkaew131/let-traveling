import { useEffect, useMemo, useState } from 'react'
import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog'
import { Pencil } from 'lucide-react'

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export type EditTarget =
    | { type: 'day'; day: number; currentTitle?: string }
    | { type: 'hotel'; currentName?: string }
    | { type: 'flight' }

function titleForTarget(target: EditTarget) {
    if (target.type === 'day') return `Edit Day ${target.day}`
    if (target.type === 'hotel') return 'Edit Hotel'
    return 'Edit Flights'
}

function defaultPromptForTarget(target: EditTarget) {
    if (target.type === 'day') {
        return `Change Day ${target.day}. Example: “Replace temples with shopping and a night market.”`
    }
    if (target.type === 'hotel') {
        return `Change the hotel. Example: “Closer to the city center, 4-star, with breakfast included.”`
    }
    return `Change the flights. Example: “Earlier departure, fewer layovers, keep it under $800.”`
}

export function EditPlanModal({
    open,
    target,
    onOpenChange,
    onSubmit,
}: {
    open: boolean
    target: EditTarget | null
    onOpenChange: (open: boolean) => void
    onSubmit: (text: string) => void
}) {
    const [text, setText] = useState('')

    useEffect(() => {
        if (!open) return
        setText('')
    }, [open])

    const heading = useMemo(() => {
        return target ? titleForTarget(target) : 'Edit'
    }, [target])

    const placeholder = useMemo(() => {
        return target
            ? defaultPromptForTarget(target)
            : 'Describe what to change…'
    }, [target])

    const canSubmit = text.trim().length > 0

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent size="default" className="max-w-lg">
                <AlertDialogHeader>
                    <div className="bg-muted inline-flex size-12 items-center justify-center rounded-md">
                        <Pencil className="size-5" />
                    </div>
                    <AlertDialogTitle>{heading}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tell me what you want to change. I’ll update just this
                        part of the trip.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="grid gap-3">
                    <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={placeholder}
                        className="min-h-28"
                        autoFocus
                    />
                    <p className="text-muted-foreground text-xs">
                        Tip: be specific about vibe, budget, timing, and must-do
                        places.
                    </p>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogPrimitive.Close
                        render={
                            <Button type="button" disabled={!canSubmit}>
                                Apply Changes
                            </Button>
                        }
                        onClick={() => {
                            if (!canSubmit) return
                            onSubmit(text.trim())
                        }}
                    />
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
