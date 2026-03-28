import { streamText } from 'ai';
import { openai, createOpenAI } from "@ai-sdk/openai";


function createPrompt(userQuestion: string | undefined, websiteContent: string): string {
    
    return `
You are an advanced website analyst.

---
Your job entails analyzing the content of a website as well as any question presented by the user. If the user
does not ask a question about the website content, just describe what the website contains.
---

---
User Question: ${userQuestion}
---

---
Website Content: ${websiteContent}
---
`

}


export async function analyzeWebsiteContentLLM(websiteContent: string, userQuestion: string) {

    /*
    Analyze the HTML of a website and answer any questions regarding it.
    */

    let completePrompt = createPrompt(userQuestion, websiteContent);
    // let openai = createOpenAI({
    //     apiKey: process.env.OPENAI_API_KEY,
    // });

    const result = streamText({
        model: openai("gpt-5"),
        prompt: completePrompt,
      });
      
      // example: use textStream as an async iterable
      for await (const textPart of result.textStream) {
        process.stdout.write(textPart);
      }

}