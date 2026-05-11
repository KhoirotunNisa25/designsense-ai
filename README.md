# DesignSense AI

DesignSense AI is an AI-powered design review tool that analyzes UI screenshots and generates structured usability, accessibility, and UX feedback using the Gemini Vision API.

## Features

- **Drag & Drop Upload:** Easily upload your UI snapshots (Web, Mobile, or Dashboard).
- **Structured Feedback:** Get actionable insights categorized by Visual Hierarchy, Accessibility, UX Issues, and Suggestions.
- **Scoring System:** Receive an overall score and specific metrics to evaluate your design objectively.
- **Custom Prompting:** Add optional prompts to focus the AI on specific aspects of your design.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **Styling:** Tailwind CSS
- **AI:** Google Gemini Vision API (`gemini-2.5-flash`)
- **Language:** TypeScript

## Getting Started

### 1. Set up your environment variables

Create a `.env.local` file in the root of the project and add your Google Gemini API key:

```bash
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

*(You can obtain a Gemini API key from Google AI Studio).*

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app in action. Upload a screenshot to get instant design feedback!

## License

MIT

