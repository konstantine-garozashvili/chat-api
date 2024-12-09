# Development Notes

## Architecture
- Backend: Node.js + Express + Socket.IO
- Database: MongoDB Atlas
- Frontend: Vanilla JS Widget
- Deployment: Render.com

## Key Files
1. index.js - Main server file
2. dist/widget.js - Chat widget code
3. example/test-widget.html - Test implementation
4. src/models/* - Database models

## API Endpoints
- GET /widget.js - Widget code
- POST /api/auth/register - User registration
- POST /api/messages - Send message

## Socket Events
- connection - New client connected
- message - New chat message
- disconnect - Client disconnected

## Database Schema
- Users collection
- Messages collection
- Rooms collection

## Testing
- user1.html and user2.html for testing
- example/test-widget.html for integration testing

## Deployment
- Render.com for hosting
- MongoDB Atlas for database
- GitHub for version control 