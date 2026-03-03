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
    return (
        <form className="bg-background focus-within:ring-primary/30 focus-within:ring-offset-background relative overflow-hidden rounded-xl border focus-within:ring-2">
            <Textarea
                rows={1}
                className="min-h-11.5 w-full resize-y overflow-y-auto border-none px-4 py-3 pr-12 text-sm focus-visible:outline-none"
                {...props}
            />
            <Button
                type="submit"
                size="icon"
                disabled={props.disabled || props.isLoading}
                className="absolute top-2 right-2 size-8 rounded-lg"
                onClick={props.onSubmit}
            >
                {props.isLoading ? (
                    <IconLoader className="size-4 animate-spin" />
                ) : (
                    <IconSend className="size-4" />
                )}
            </Button>
        </form>
    )
}
