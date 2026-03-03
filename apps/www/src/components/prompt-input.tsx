import { IconSend } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type PromptInputProps = React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
>

export default function PromptInput(props: PromptInputProps) {
    return (
        <form className="relative rounded-xl overflow-hidden border bg-background">
            <Textarea
                rows={1}
                className="min-h-11.5 w-full resize-y overflow-y-auto  border-none px-4 py-3 pr-12 text-sm"
                {...props}
            />
            <Button
                type="submit"
                size="icon"
                disabled={!props.disabled}
                className="absolute right-2 top-2 size-8 rounded-lg"
            >
                <IconSend className="size-4" />
            </Button>
        </form>
    )
}
