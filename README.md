# Doctor Dashboard - AI-Powered Medical Assistant

A comprehensive React-based doctor dashboard application that provides healthcare professionals with advanced tools for patient management, medical records, and AI-assisted consultations.

## 🏥 Features

### Core Functionality
- **Patient Management**: Complete patient portal with medical history tracking
- **Appointments**: Schedule and manage patient appointments
- **Medical Records**: Secure access to patient medical records and lab reports
- **Prescriptions**: Digital prescription management system
- **Analytics**: Comprehensive healthcare analytics and reporting
- **Voice Assistant**: AI-powered voice transcription and assistance
- **Real-time Messaging**: Secure doctor-patient communication

### AI-Powered Features
- **Deepgram Integration**: Real-time voice transcription during consultations
- **Medical Notes**: AI-assisted note-taking and documentation
- **Follow-up Management**: Automated follow-up scheduling and reminders
- **Lab Results Analysis**: Chart visualization for lab results and vitals

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jyothikaraj1423/doc-assist-ai.git
   cd doc-assist-ai
   ```

2. **Install dependencies**
   ```bash
   cd doctor-dashboard
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## 📁 Project Structure

```
doctor-dashboard/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── Dashboard.js    # Main dashboard
│   │   ├── PatientPortal.js # Patient management
│   │   ├── Appointments.js # Appointment scheduling
│   │   ├── Prescriptions.js # Prescription management
│   │   ├── LabReports.js   # Lab results
│   │   ├── Analytics.js    # Analytics dashboard
│   │   └── VoiceAssistant.js # Voice AI features
│   ├── services/           # API services
│   ├── hooks/             # Custom React hooks
│   └── styles/            # CSS files
├── backend/               # Backend API (Node.js)
└── package.json
```

## 🛠️ Technologies Used

- **Frontend**: React 19.1.0, React DOM
- **Charts**: Recharts for data visualization
- **Icons**: React Icons
- **PWA**: Progressive Web App capabilities
- **Voice AI**: Deepgram integration
- **Backend**: Node.js with Express
- **Deployment**: GitHub Pages

## 📱 PWA Features

This application is built as a Progressive Web App (PWA) with:
- Offline functionality
- Installable on mobile devices
- Service worker for caching
- Responsive design for all screen sizes

## 🔧 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App
- `npm run deploy` - Deploys to GitHub Pages

## 🚀 Deployment

The application is configured for automatic deployment to GitHub Pages:

```bash
npm run deploy
```

## 🔐 Security Features

- Secure patient data handling
- HIPAA-compliant design considerations
- Encrypted communication channels
- Role-based access control

## 📊 Analytics & Reporting

- Patient visit analytics
- Medical procedure tracking
- Lab results trending
- Prescription analytics
- Appointment scheduling insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Jyothi Raj** - *Initial work* - [jyothikaraj1423](https://github.com/jyothikaraj1423)

## 🙏 Acknowledgments

- React team for the amazing framework
- Deepgram for voice AI capabilities
- Recharts for data visualization
- All contributors and testers

## 📞 Support

For support, email jyothikaraj5k@gmail.com or create an issue in the repository.

---

**Note**: This is a healthcare application. Please ensure compliance with local healthcare regulations and data protection laws before deployment in production environments.
