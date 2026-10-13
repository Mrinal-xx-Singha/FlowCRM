"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { aiApi } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Check, Copy, Loader2, Mail, Sparkle, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";


interface AiEmailModalProps {
    customerId: number;
    customerName: string;
    customerEmail?: string;
    jobId?: number;
}

export function AiEmailModal({ customerId, customerName, customerEmail, jobId }: AiEmailModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [tone, setTone] = useState<"professional" | "friendly" | "urgent">("professional")
    const [subject, setSubject] = useState("")
    const [body, setBody] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [copied, setIsCopied] = useState(false)

    const handleGenerate = async () => {
        setIsLoading(true)
        try {
            const data = await aiApi.draftEmail({
                customer_id: customerId,
                job_id: jobId,
                tone,
            })

            setSubject(data.draft.subject)
            setBody(data.draft.body)
            toast.success("AI draft generated!")
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to generate AI email");

        } finally {
            setIsLoading(false)
        }

    }

    const handleCopy = () => {
        navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`)
        setIsCopied(true)
        toast.success("Draft copied to clipboard!")
        setTimeout(() => setIsCopied(false), 2000)
    }

    const handleOpenMailClient = () => {
        const mailto = `mailto:${customerEmail || ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
    }



    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-indigo-200 dark:border-indigo-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
                    <Sparkle className="h-4 w-4" />
                    Draft with AI
                </Button>

            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <Sparkle className="h-5 w-5 text-indigo-500" />
                        AI Follow-Up Email Drafter

                    </DialogTitle>
                    <DialogDescription>
                        Personalized for <strong>{customerName}</strong> using notes and deal status.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-3">
                        <Label className="text-sm font-medium">Tone:</Label>
                        <Select value={tone} onValueChange={(val: any) => setTone(val)}>
                            <SelectTrigger className="w-36">
                                <SelectValue placeholder="Tone" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="professional">Professional</SelectItem>
                                <SelectItem value="friendly">Friendly</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button onClick={handleGenerate} disabled={isLoading} className="ml-auto gap-2">
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                            {body ? "Regenerate" : "Generate Draft"}
                        </Button>
                    </div>
                    {body && (
                        <div className="space-y-3 pt-2">
                            <div>
                                <Label className="text-xs text-muted-foreground">Subject</Label>
                                <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="font-medium" />
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">Body</Label>
                                <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} className="text-sm leading-relaxed" />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button variant="outline" onClick={handleCopy} className="gap-2 text-xs">

                                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                    {copied ? "Copied" : "Copy to Clipboard"}
                                </Button>
                                <Button
                                    onClick={handleOpenMailClient}
                                    className="gap-2 text-xs">
                                    <Mail />
                                    Open in Mail
                                </Button>

                            </div>

                        </div>
                    )}
                </div>

            </DialogContent>
        </Dialog>

    )


}