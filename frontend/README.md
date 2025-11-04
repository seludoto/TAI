# TAI Frontend

Next.js frontend for the TAI (Tanzania Artificial Intelligence) Developer Assistant.

## Features

- 💬 Modern chat interface with real-time messaging
- 🎨 Syntax-highlighted code blocks
- 🔐 User authentication (login/register)
- 📱 Responsive design for mobile and desktop
- 🌙 Clean, modern UI with Tailwind CSS
- ⚡ Fast and optimized with Next.js 14

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Syntax Highlighting**: React Syntax Highlighter
- **HTTP Client**: Axios

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   Copy `.env.local` and update the values:
   ```bash
   cp .env.local .env.local.example
   # Edit .env.local with your actual values
   ```

### Running the Frontend

**Development mode:**
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Production build:**
```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── ChatInterface.tsx    # Main chat component
│   │   ├── ChatSidebar.tsx      # Chat list sidebar
│   │   ├── MessageList.tsx      # Message display
│   │   ├── MessageInput.tsx     # Message input form
│   │   └── AuthModal.tsx        # Authentication modal
│   ├── lib/                 # Utilities
│   │   └── api.ts           # API client functions
│   └── types/               # TypeScript type definitions
│       └── index.ts         # Type definitions
├── public/                  # Static assets
├── .env.local              # Environment variables
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── package.json            # Dependencies and scripts
```

## Components

### ChatInterface
The main component that orchestrates the entire chat experience. Handles:
- Authentication state
- Chat management
- Message sending/receiving
- UI state management

### ChatSidebar
Displays the list of user chats with options to:
- Create new chats
- Switch between chats
- View user profile
- Logout

### MessageList
Renders chat messages with:
- Syntax highlighting for code blocks
- User/assistant avatars
- Timestamps
- Loading indicators

### MessageInput
Message composition interface with:
- Multi-line text input
- Programming language selection
- Code block insertion
- Keyboard shortcuts

### AuthModal
Authentication interface for:
- User login
- User registration
- Form validation
- Error handling

## API Integration

The frontend communicates with the FastAPI backend through the `api.ts` file, which provides:

- Authentication functions (login, register, get current user)
- Chat management (create, list, delete chats)
- Message handling (send, receive messages)
- Automatic token management
- Error handling

## Styling

### Tailwind CSS Classes

The app uses Tailwind CSS for styling with a focus on:
- Responsive design (`sm:`, `md:`, `lg:` breakpoints)
- Dark/light mode compatibility
- Accessible color schemes
- Consistent spacing and typography

### Custom Styles

Additional styles are defined in `globals.css` for:
- Base styles
- Custom animations
- Font loading

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

## Development

### Adding New Components

1. Create component in `src/components/`
2. Export from component file
3. Import and use in parent components
4. Add TypeScript types in `src/types/`

### API Integration

1. Add new API functions in `src/lib/api.ts`
2. Define TypeScript interfaces in `src/types/`
3. Use in components with proper error handling

### Styling Guidelines

- Use Tailwind utility classes
- Follow mobile-first responsive design
- Maintain consistent color scheme
- Ensure accessibility (contrast, focus states)

## Building for Production

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

3. **Export static files (optional):**
   ```bash
   npm run export
   ```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- Self-hosted with Docker

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow TypeScript and ESLint rules
2. Use meaningful component and variable names
3. Add comments for complex logic
4. Test on multiple screen sizes
5. Ensure accessibility compliance

## License

MIT License
