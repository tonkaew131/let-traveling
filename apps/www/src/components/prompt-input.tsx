import * as React from 'react'
import { IconLoader, IconSend } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type PromptInputProps = React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
> & {
    onSubmit?: () => void
    isLoading?: boolean
}

export default function PromptInput(props: PromptInputProps) {
    const {
        onSubmit,
        isLoading,
        className,
        onKeyDown,
        onInput,
        onChange,
        value,
        disabled,
        ...textareaProps
    } = props

    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

    const resizeToFit = React.useCallback(() => {
        const el = textareaRef.current
        if (!el) return

        el.style.height = 'auto'
        el.style.height = `${el.scrollHeight}px`
    }, [])

    React.useLayoutEffect(() => {
        resizeToFit()
    }, [resizeToFit, value])

    return (
        <form
            className="bg-background focus-within:ring-primary/30 focus-within:ring-offset-background relative overflow-hidden rounded-xl border focus-within:ring-2"
            onSubmit={(e) => {
                e.preventDefault()
                onSubmit?.()
            }}
        >
            <Textarea
                {...textareaProps}
                ref={textareaRef}
                value={value}
                disabled={disabled}
                rows={1}
                className={`min-h-11.5 w-full resize-none overflow-y-auto border-none px-4 py-3 pr-12 text-sm focus-visible:outline-none${className ? ` ${className}` : ''}`}
                onInput={(e) => {
                    onInput?.(e)
                    if (e.defaultPrevented) return
                    resizeToFit()
                }}
                onChange={(e) => {
                    onChange?.(e)
                    resizeToFit()
                }}
                onKeyDown={(e) => {
                    onKeyDown?.(e)
                    if (e.defaultPrevented) return

                    const isComposing = (e.nativeEvent as any)?.isComposing
                    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
                        e.preventDefault()
                        if (disabled || isLoading) return
                        onSubmit?.()
                    }
                }}
            />
            <Button
                type="submit"
                size="icon"
                disabled={disabled || isLoading}
                className="absolute top-2 right-2 size-8 rounded-lg"
            >
                {isLoading ? (
                    <IconLoader className="size-4 animate-spin" />
                ) : (
                    <IconSend className="size-4" />
                )}
            </Button>
        </form>
    )
}
