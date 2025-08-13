# OnlyCabs – Smart Ride-Hailing Platform

OnlyCabs is a cross-platform ride-hailing application designed to connect users and drivers seamlessly. Built with modern technologies like React Native, Firebase, and Python, it offers real-time ride booking, driver tracking, and automated analytics for enhanced user experience.

---

## Features

- **User and Driver Registration**: Secure and intuitive onboarding for both users and drivers.
- **Real-Time Ride Booking**: Instant ride requests with live driver tracking.
- **Firebase Integration**: Secure authentication, real-time database synchronization, and cloud storage.
- **Interactive Dashboards**: Automated analytics for users and drivers to track progress and performance.
- **Optimized Backend**: Python-based backend with RESTful APIs for efficient ride allocation and data handling.

---

## Tech Stack

- **Frontend**: React Native, Expo
- **Backend**: Python, Flask
- **Database**: Firebase Realtime Database
- **Cloud Services**: Firebase Authentication, Firebase Cloud Functions
- **Other Tools**: Docker (for containerization), Git (for version control)

---

## Installation

### Prerequisites
- Node.js and npm installed
- Python 3.x installed
- Expo CLI installed globally
- Firebase project set up

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/onlycabs.git
   cd onlycabs
   ```

2. Install dependencies for the frontend:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project.
   - Add your Firebase configuration to `firebaseConfig.ts`.

4. Run the app:
   ```bash
   expo start
   ```

5. (Optional) Start the backend:
   ```bash
   cd backend
   python server.py
   ```

---

## Usage

1. **Users**: Register, log in, and book rides in real-time.
2. **Drivers**: Register, log in, and accept ride requests.
3. **Admins**: Monitor analytics and manage the platform.

---

## Folder Structure

```
taxie/
├── app/                # React Native components
├── assets/             # Images and fonts
├── backend/            # Python backend services
├── .expo/              # Expo configuration
├── .vscode/            # VS Code settings
├── package.json        # Frontend dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

---

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For questions or feedback, feel free to reach out:
- **Email**: your-email@example.com
- **GitHub**: [your-username](https://github.com/your-username)
