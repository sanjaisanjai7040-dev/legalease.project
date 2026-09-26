A browser-based
legal document analyzer, contract review assistant, and AI legal chatbot
powered by Google Gemini when an API key is supplied.

|     |
| --- |

**Frontend**

|     |
| --- |

HTML5 + CSS3 + Vanilla
  JavaScript

|     |
| --- |

**AI
  Integration**

|     |
| --- |

Google Gemini 2.0 Flash REST API

|     |
| --- |

**Demo
  Mode**

|     |
| --- |

Built-in sample analysis and
  chatbot responses

|     |
| --- |

**Local
  Server**

|     |
| --- |

PowerShell HttpListener on
  localhost:4000

Source basis: the supplied
index.html, style.css, app.js, server.ps1, and LegalEase logo.

# 1. Project Overview

LegalEase is a single-page web
application designed to help users understand legal documents using an
interactive frontend and optional Gemini AI integration. The supplied
implementation includes document analysis, contract review, a legal AI chatbot,
pricing UI, responsive navigation, animations, and a local PowerShell static
server.

The HTML defines the main
navigation and application sections, including Home, Features, How It Works,
Analyze, AI Chat, and Pricing. 

## Core capabilities

•  **AI Document Analyzer:** paste legal text, select a
sample, optionally provide a Gemini API key, and receive a structured risk
analysis.

•  **Contract Review:** review a contract with a selected
focus: general overview, risks, obligations/deadlines, financial terms, or
termination.

•  **Legal AI Chat:** ask general legal questions, use
quick prompts, and maintain an in-page chat history.

•  **Demo mode:** the application can operate
without an API key using built-in demo analysis and canned legal-topic
responses.

•  **Responsive UI:** mobile navigation, animated
cards, smooth scrolling, intersection-observer reveal animations, and
interactive toast messages.

## Important implementation note

The supplied frontend calls the Gemini REST endpoint directly
from browser JavaScript and accepts the API key in a password field. This is
suitable for a local/demo implementation, but a production deployment should
normally keep the API key on a server-side backend rather than exposing it to
browser code.

# 2. Technology Stack

|     |
| --- |

**Layer**

|     |
| --- |

**Technology
  / Implementation**

|     |
| --- |

Markup

|     |
| --- |

HTML5 single-page application

|     |
| --- |

Styling

|     |
| --- |

CSS3 with custom variables,
  responsive layouts, glass-style cards, gradients and animations

|     |
| --- |

Client logic

|     |
| --- |

Vanilla JavaScript

|     |
| --- |

AI

|     |
| --- |

Google Gemini 2.0 Flash REST API

|     |
| --- |

Fonts

|     |
| --- |

Inter and Playfair Display via
  Google Fonts

|     |
| --- |

Local server

|     |
| --- |

PowerShell + .NET HttpListener

|     |
| --- |

Static assets

|     |
| --- |

HTML, CSS, JS and JPG logo

# 3. Application Features

## Document Analysis

The analyzer accepts pasted legal
text and includes Sample NDA, Sample Contract, and Clear controls. The UI also
provides a Gemini API key field and an Analyze with AI action. 

## Risk Analysis Output

AI analysis is expected to return
document type, an overall 0–100 risk score, risk level, executive summary, key
risks, key clauses, and recommendations. The JavaScript renders these results
into cards. 

## Contract Review

The contract reviewer supports
five review focuses: general overview, risk identification,
obligations/deadlines, financial terms, and termination conditions. 

## Contract Results

The review output displays
contract type, parties, assessment, executive summary, financial terms, key
obligations, critical dates, and negotiation points. 

## AI Chatbot

The chat interface supports quick
questions about NDAs, liability/indemnification, non-competes, service
agreements, force majeure, and payment terms. 

## Demo Mode

Without a Gemini key, document
analysis and chat use local JavaScript fallback logic. The app explicitly
displays a demo-mode notification so the user knows that real AI analysis
requires a key. 

# 4. User Interface Sections

|     |
| --- |

**Section**

|     |
| --- |

**Purpose**

|     |
| --- |

Home / Hero

|     |
| --- |

Introduces LegalEase and
  provides Analyze a Document and Review a Contract actions.

|     |
| --- |

Features

|     |
| --- |

Presents Smart Document
  Analysis, Contract Review, Legal Risk Assessment and Real-time Collaboration.

|     |
| --- |

How It Works

|     |
| --- |

Explains upload/paste → AI analysis → clear
  insights workflow.

|     |
| --- |

Analyze

|     |
| --- |

Interactive legal document
  analysis workspace.

|     |
| --- |

Review

|     |
| --- |

Interactive contract
  summarization/review workspace.

|     |
| --- |

AI Chat

|     |
| --- |

Conversational legal assistant
  with quick prompts.

|     |
| --- |

Pricing

|     |
| --- |

Starter, Professional and
  Enterprise pricing cards.

# 5. Project Structure

LegalEase/

■■■ index.html

■■■ style.css

■■■ app.js

■■■ server.ps1

■■■
legalease_logo.jpg **index.html** — application
structure, navigation, hero, feature cards, analyzer, contract review, chatbot,
pricing and footer. The document loads style.css and app.js. 

**style.css** — visual
design system and responsive layout. The supplied theme uses navy, gold, blue,
purple, green and red variables, with glass-like surfaces and animated UI
elements. 

**app.js** — application behavior: navigation, sample data, Gemini
requests, document analysis, contract review, chat, toast notifications and
animations. **server.ps1** — lightweight
local static file server. It listens on localhost:4000 and serves HTML, CSS,
JS, image and font MIME types.  **legalease_logo.jpg** — supplied LegalEase logo used by
the navigation and footer.

# 6. Application Flow

|     |
| --- |

**Step**

|     |
| --- |

**Flow**

|     |
| --- |

1

|     |
| --- |

User opens the LegalEase page
  through the local server.

|     |
| --- |

2

|     |
| --- |

User navigates to Analyze,
  Review, or AI Chat.

|     |
| --- |

3

|     |
| --- |

User pastes legal content or
  loads a built-in sample.

|     |
| --- |

4

|     |
| --- |

If a Gemini API key is present,
  browser JavaScript sends a request to Gemini 2.0 Flash.

|     |
| --- |

5

|     |
| --- |

The response is parsed/rendered
  into structured UI cards.

|     |
| --- |

6

|     |
| --- |

If no key is present, the
  corresponding demo fallback is used.

## Gemini request details

The supplied JavaScript targets
the Gemini 2.0 Flash generateContent endpoint and sends a text prompt inside
the request body. The configured generation settings use temperature 0.3 and a
maximum of 2048 output tokens.



# 7. VS Code Setup & Installation

The supplied project is
intentionally lightweight: it does not contain a package.json or Node.js
dependency setup.

The main requirements are a modern
browser and, for the supplied server script, Windows PowerShell.

**Step 1 —
Create/open the project folder**

Place these files in one folder: **index.html**, **style.css**, **app.js**, **server.ps1**, and **legalease_logo.jpg**.

## Step 2 — Open in VS Code

File → Open Folder
→ select your
LegalEase project folder

Confirm that the HTML references
match the filenames exactly: style.css, app.js, and legalease_logo.jpg.

## Step 3 — Configure the PowerShell server path

The supplied server script
currently contains a Windows-specific root path. Change **$rootPath** to the actual folder location on your computer before
running it. The server uses this path to locate the static files. 

$port = 4000

$rootPath =
"C:\Path\To\Your\LegalEase"

## Step 4 — Start the local server

PowerShell

cd
C:\Path\To\Your\LegalEase Set-ExecutionPolicy -Scope Process -ExecutionPolicy
Bypass

.\server.ps1

The script reports that LegalEase
is running at **http\://localhost:4000**.


## Step 5 — Open the application

http\://localhost:4000

The server maps the root request /
to index.html. 

## Step 6 — Optional Gemini API key

For real AI analysis, enter a
valid Gemini API key in the analyzer or chat interface. The key is read by the
browser-side JavaScript and used in the Gemini request.

# 8. How to Use LegalEase

## A. Analyze a legal document

•  Open **Analyze** from the navigation.

•  Paste legal
text into Document Input, or choose Sample NDA / Sample Contract.

•  Optionally
enter the Gemini API key.

•  Click **Analyze with AI**.

•  Review document
type, risk score, risk level, executive summary, key risks, key clauses and
recommendations.

The analyzer shows a loading
sequence for parsing structure, identifying clauses, assessing risks and
generating a summary. 

## B. Review a contract

•  Open **Review**.

•  Paste the
contract or use Load Sample.

•  Choose the
desired Review Focus.

•  Click **Review Contract**.

•  Read the
contract overview, parties, assessment, financial terms, obligations, critical
dates and negotiation points.

## C. Use the AI chatbot

•  Open **AI Chat**.

•  Choose a Quick
Question or type your own legal question.

•  Press Enter to
send (Shift+Enter can be used for a new line).

•  Use Clear Chat
to reset the conversation.

•  Add a Gemini
API key for real AI answers; otherwise the built-in demo responses are used.

The chatbot code keeps recent
conversation messages, sends the recent context to Gemini when a key is
present, and otherwise uses predefined topic responses. 

# 9. Pricing UI Included in the Supplied Frontend

The pricing section is currently
presentation/UI only. The supplied buttons display a 'Signup flow coming soon!'
toast rather than implementing account creation or billing. 

|     |
| --- |

**Plan**

|     |
| --- |

**Displayed
  price**

|     |
| --- |

**Included
  highlights**

|     |
| --- |

Starter

|     |
| --- |

$0/month

|     |
| --- |

10 analyses/month, 5 contract
  reviews/month, basic risk scoring

|     |
| --- |

Professional

|     |
| --- |

$49/month

|     |
| --- |

Unlimited analyses/reviews,
  advanced scoring, 5-user collaboration, PDF/Word export

|     |
| --- |

Enterprise

|     |
| --- |

$199/month

|     |
| --- |

Unlimited members, custom AI
  fine-tuning, API access, dedicated support

# 10. Troubleshooting

## Page does not load

Check that PowerShell shows the
listener started and open http\://localhost:4000. Verify the $rootPath points to
the folder containing index.html.

## 404 for CSS/JS/logo

Make sure style.css, app.js and
legalease_logo.jpg are in the same project directory as index.html. The server
only serves files that exist under its configured root.

## Gemini API error

Check the API key, browser network
errors, quota/permissions, and the Gemini endpoint/model availability. The
JavaScript displays the returned API error message when the request is not
successful.

## AI analysis returns malformed output

The application expects JSON for
analysis/review and attempts to extract a JSON object from the model response.

If the model returns incompatible
content, parsing can fail.

## Demo works but real AI does not

|     |
| --- |

**Included in supplied code**

|     |
| --- |

**Not implemented as a working backend**

|     |
| --- |

Single-page
  responsive UI

|     |
| --- |

User
  authentication / real login

|     |
| --- |

Gemini
  browser API calls

|     |
| --- |

Secure
  server-side API proxy

This is expected when no key is
supplied: the app has explicit fallback demo logic. Add the API key only when
you want the Gemini-backed path.

## PowerShell execution policy blocks script

Run Set-ExecutionPolicy -Scope
Process -ExecutionPolicy Bypass in the current PowerShell session, then start
.\server.ps1.

# 11. Security & Production Considerations

•  **Protect API keys:** the supplied frontend accepts a
Gemini key directly in the browser. For production, place the Gemini call
behind a secure backend API.

•  **Validate user input:** legal documents can contain
arbitrary text. Add server-side validation, size limits, authentication and
rate limiting before exposing the service publicly.

•  **Protect sensitive legal documents:** add an
explicit data-retention policy, access controls, encryption, audit logging and
secure storage if uploaded documents are persisted.

•  **Do not treat AI output as legal advice:** the UI itself
states that AI responses are informational and recommends consulting a
qualified attorney. 

•  **Verify marketing claims before publishing:** the UI
contains claims such as accuracy, number of documents, certifications and firms
served. These are presentation text in the supplied source and should be
independently substantiated before being used as real-world claims.

# 12. Current Scope vs. Future Backend Work

|     |
| --- |

Demo analysis and chat fallbacks

|     |
| --- |

Persistent document database

|     |
| --- |

Local PowerShell static server

|     |
| --- |

Real subscription/billing
  integration

|     |
| --- |

Pricing and signup UI

|     |
| --- |

Real collaboration/workspaces

|     |
| --- |

Legal analysis result rendering

|     |
| --- |

Production document
  upload/storage pipeline



# 13. Quick Reference

## Project files

index.html       → UI structure

style.css        → visual design and responsive styles app.js           → AI, analyzer, reviewer, chat and interactions server.ps1       → local static server on port 4000 legalease_logo.jpg → LegalEase
brand logo

## Main JavaScript functions

|     |
| --- |

**Function**

|     |
| --- |

**Purpose**

|     |
| --- |

analyzeDocument()

|     |
| --- |

Runs document analysis using
  Gemini or demo fallback.

|     |
| --- |

reviewContract()

|     |
| --- |

Runs contract review using
  Gemini or demo fallback.

|     |
| --- |

sendChatMessage()

|     |
| --- |

Sends chatbot messages using
  Gemini or demo responses.

|     |
| --- |

loadSample()

|     |
| --- |

Loads sample NDA or contract
  text into the analyzer.

|     |
| --- |

renderAnalysis()

|     |
| --- |

Renders structured
  document-analysis results.

|     |
| --- |

renderReview()

|     |
| --- |

Renders structured
  contract-review results.

|     |
| --- |

showToast()

|     |
| --- |

Displays temporary status
  messages.

## Quick start

1\. Open the
LegalEase folder in VS Code

2\. Edit
$rootPath in server.ps1

3\. Run:
.\server.ps1

4\. Open:
http\://localhost:4000

5\. Try Sample
NDA → Analyze
with AI

6\. Try Review → Load Sample
→ Review
Contract

7\. Try AI Chat → ask a legal
question

This README describes the supplied project as provided. It does
not claim that unimplemented backend, billing, authentication, database,
collaboration, or production-security functionality is already present.
