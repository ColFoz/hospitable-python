# Hospitable Dashboard

An interactive web dashboard for managing Hospitable vacation rentals, built with Next.js and shadcn/ui components.

## Features

- **Modern UI**: Built with Next.js 14, TypeScript, and shadcn/ui components
- **Real-time Data**: View properties, reservations, messages, and reviews
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Secure Authentication**: Token-based authentication with Hospitable API
- **FastAPI Backend**: Python FastAPI backend wrapping the Hospitable SDK

## Architecture

```
hospitable-python/
├── backend/           # FastAPI backend
│   ├── main.py       # API endpoints
│   └── requirements.txt
├── dashboard/        # Next.js frontend
│   ├── app/          # App router pages
│   ├── components/   # React components
│   └── lib/          # Utilities and API client
└── hospitable/       # Python SDK
```

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+
- Hospitable API Token (get from [my.hospitable.com](https://my.hospitable.com))

### 1. Install Python Dependencies

```bash
# Install the Hospitable SDK
pip install -e .

# Install backend dependencies
cd backend
pip install -r requirements.txt
```

### 2. Configure Backend

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit `.env` and add your Hospitable token:

```
HOSPITABLE_PAT=your_personal_access_token_here
```

### 3. Start the Backend

```bash
cd backend
python main.py
```

The API will be available at `http://localhost:8000`

You can view the API docs at `http://localhost:8000/docs`

### 4. Install Dashboard Dependencies

```bash
cd dashboard
npm install
```

### 5. Configure Dashboard

Create a `.env.local` file in the `dashboard` directory:

```bash
cd dashboard
cp .env.example .env.local
```

The default configuration should work if the backend is running on `localhost:8000`.

### 6. Start the Dashboard

```bash
cd dashboard
npm run dev
```

The dashboard will be available at `http://localhost:3000`

## Usage

### Login

1. Open `http://localhost:3000` in your browser
2. Enter your Hospitable API token
3. Click "Login"

**Getting Your Token:**
1. Go to [my.hospitable.com](https://my.hospitable.com)
2. Navigate to **Apps** → **API access** → **Access tokens**
3. Click **+ Add new** and select permissions
4. Copy your token

### Dashboard Features

- **Dashboard Home**: Overview of properties, reservations, messages, and reviews
- **Properties**: View all your vacation rental properties with details
- **Reservations**: See upcoming and past bookings
- **Messages**: (Coming soon) Send and receive guest messages
- **Reviews**: (Coming soon) Manage property reviews
- **Settings**: View user info and token permissions

## API Endpoints

The FastAPI backend provides the following endpoints:

### User
- `GET /user` - Get authenticated user information
- `GET /token-info` - Get JWT token information

### Properties
- `GET /properties` - List all properties
- `GET /properties/{property_uuid}` - Get specific property
- `GET /properties/{property_uuid}/calendar` - Get property calendar

### Reservations
- `POST /reservations/query` - Query reservations with filters
- `GET /reservations/{reservation_uuid}` - Get specific reservation

### Messages
- `GET /messages/{reservation_uuid}` - Get messages for a reservation
- `POST /messages/{reservation_uuid}` - Send a message

### Reviews
- `GET /reviews/{property_uuid}` - Get reviews for a property
- `POST /reviews/{review_uuid}/respond` - Respond to a review

## Development

### Backend Development

```bash
cd backend

# Run with auto-reload
uvicorn main:app --reload

# View API documentation
open http://localhost:8000/docs
```

### Frontend Development

```bash
cd dashboard

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.8+
- **SDK**: Hospitable Python SDK
- **CORS**: Enabled for local development

## Customization

### Adding New Pages

1. Create a new page in `dashboard/app/your-page/page.tsx`
2. Add navigation item in `dashboard/components/dashboard-nav.tsx`
3. Add API endpoint in `backend/main.py` if needed
4. Add API client method in `dashboard/lib/api.ts`

### Styling

The dashboard uses Tailwind CSS and shadcn/ui components. You can customize:

- **Colors**: Edit `dashboard/app/globals.css` CSS variables
- **Components**: Modify components in `dashboard/components/ui/`
- **Layout**: Update `dashboard/components/dashboard-nav.tsx`

## Troubleshooting

### Backend Issues

**Problem**: `AuthenticationError` when starting backend
- **Solution**: Check that your `HOSPITABLE_PAT` is set correctly in `backend/.env`

**Problem**: `ModuleNotFoundError: No module named 'hospitable'`
- **Solution**: Install the SDK: `pip install -e .` from the project root

### Frontend Issues

**Problem**: API connection refused
- **Solution**: Make sure the backend is running on `http://localhost:8000`

**Problem**: Authentication fails
- **Solution**: Verify your Hospitable token is valid and has proper permissions

**Problem**: Components not styled correctly
- **Solution**: Make sure Tailwind CSS is configured properly and `npm install` completed successfully

## Production Deployment

### Backend

```bash
# Install dependencies
pip install -r backend/requirements.txt

# Set environment variable
export HOSPITABLE_PAT=your_token_here

# Run with production server
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

### Frontend

```bash
# Build the application
cd dashboard
npm run build

# Start production server
npm start
```

Or deploy to:
- **Vercel**: `vercel deploy`
- **Netlify**: Connect your repo
- **AWS/GCP**: Use Docker or serverless

## Security Notes

- Never commit `.env` files to version control
- Always use HTTPS in production
- Implement rate limiting for the backend API
- Use environment variables for sensitive data
- Validate and sanitize all user inputs

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- **Documentation**: [Hospitable API Docs](https://developer.hospitable.com/docs/public-api-docs/)
- **Issues**: [GitHub Issues](https://github.com/your-username/hospitable-python/issues)
- **Email**: team-platform@hospitable.com

## Screenshots

### Dashboard Home
Overview of all your properties and reservations with quick stats.

### Properties View
Complete list of vacation rental properties with details.

### Reservations
Manage bookings with guest information and status tracking.

## Roadmap

- [ ] Complete Messages interface
- [ ] Complete Reviews management
- [ ] Add calendar view for reservations
- [ ] Add charts and analytics
- [ ] Add property performance metrics
- [ ] Add bulk operations
- [ ] Add export to CSV/PDF
- [ ] Add dark mode toggle
- [ ] Add real-time notifications
- [ ] Add multi-language support

---

Built with ❤️ using the Hospitable Python SDK
