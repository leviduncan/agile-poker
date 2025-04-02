
# AgilePoker

![AgilePoker Logo](public/favicon.ico)

AgilePoker is a lightweight, real-time Planning Poker application designed to make remote estimation sessions efficient and engaging for development teams.

## Overview

AgilePoker helps software development teams collaboratively estimate the effort of user stories or tasks using the Planning Poker technique. This virtual estimation tool eliminates the need for physical cards while preserving the core benefits of simultaneous reveals and team discussion that make Planning Poker effective.

## Features

- **Quick Session Creation**: Start a new estimation session in seconds
- **One-Click Invitations**: Generate and share links to invite team members
- **Real-Time Collaboration**: All actions synchronize instantly across participants
- **Story Management**: Create, select, and track multiple user stories in a session
- **Private Voting**: Select estimation values without influencing other team members
- **Synchronized Card Reveals**: Reveal all estimates simultaneously when everyone is ready
- **Consensus Building**: Easily identify agreement or discuss differences in estimates
- **Timer Function**: Optional countdown timer to keep estimation sessions efficient
- **User Presence**: Clear indication of who's active and who has voted
- **Finalize Estimates**: Record final estimates and track completed stories
- **Mobile Responsive**: Use from any device with a web browser

## Getting Started

1. **Create a new game:**
   - Navigate to the homepage and click "Start a New Game"
   - Enter a name for your session and your display name
   - Your game will be created and you'll be taken to the game room

2. **Invite team members:**
   - Click the "Invite Players" button in the header
   - Share the auto-generated link with your team
   - Team members can join by opening the link and entering their name

3. **Add stories to estimate:**
   - Click the "Stories" button to open the story management panel
   - Add new stories with titles and optional descriptions
   - Select a story to begin the estimation process

4. **Start the estimation process:**
   - As the host, click "Start Voting" to begin the estimation round
   - Each participant selects a card value that represents their estimate
   - When everyone has voted (or the timer expires), the host can reveal all cards
   - The team can discuss, re-vote if necessary, or accept the consensus estimate
   - Finalize the estimate and move to the next story

## Usage Example

**Team Estimation Workflow:**

```
1. Sprint Planning Meeting begins
2. Scrum Master creates a new AgilePoker session
3. Team members join via the shared link
4. Product Owner adds user stories for estimation
5. For each story:
   - Team discusses requirements briefly
   - Everyone privately selects an estimate
   - All cards are revealed simultaneously
   - Team discusses any significant differences
   - Consensus is reached and recorded
6. Continue until all stories are estimated
```

## Technical Implementation

AgilePoker is built using:
- React with TypeScript for the frontend
- Tailwind CSS for styling
- Socket.io for real-time communication
- Browser localStorage for session persistence

The application uses a simulated WebSocket implementation to provide real-time functionality without requiring a backend server, making it easy to deploy and use.

## Contributing

We welcome contributions to AgilePoker! If you'd like to help improve the application:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

If you encounter any issues or have questions about AgilePoker, please open an issue in the GitHub repository or contact the support team at support@agilepoker.app

## License

AgilePoker is available under the MIT License. See the LICENSE file for more details.

## Copyright

Copyright © 2023 AgilePoker. All rights reserved.
