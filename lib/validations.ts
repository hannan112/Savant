import { z } from "zod"

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
})

export const paraphraseSchema = z.object({
  text: z.string().min(10, "Text must be at least 10 characters"),
  mode: z.enum(["standard", "formal", "casual", "academic", "creative", "simplify"]),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
export type ParaphraseData = z.infer<typeof paraphraseSchema>

