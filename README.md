# Student Onboarding Board

A modern, interactive student management dashboard built with Next.js and TypeScript. This application serves as a sample project for consideration by Playground, showcasing clean architecture, type safety, and modern web development practices.

## 🚀 Features

- **Drag-and-Drop Interface**: Intuitive Kanban-style board for managing student onboarding status
- **Student Management**: Add, edit, and track students through different onboarding stages
- **Digital Signatures**: Built-in signature capture for student verification
- **Responsive Design**: Fully responsive layout that works on desktop and mobile devices
- **Type Safety**: Built with TypeScript for enhanced developer experience and code reliability
- **Testing**: Comprehensive test coverage with React Testing Library and Jest

## 🛠️ Technology Stack

- **Frontend Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom theming
- **State Management**: React Context API with useReducer
- **Drag and Drop**: [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)
- **UI Components**: Custom built with Radix UI primitives
- **Form Handling**: React Hook Form with Zod validation
- **Testing**: Jest and React Testing Library
- **Type Safety**: TypeScript
- **Linting/Formatting**: ESLint and Prettier

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/student-onboarding-board.git
   cd student-onboarding-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate test coverage report
npm test -- --coverage
```

## 🚀 Deployment

This application is configured for deployment on [Netlify](https://www.netlify.com/). To deploy your own instance:

1. Fork this repository
2. Connect your Netlify account to your GitHub repository
3. Configure the build settings (already pre-configured in `netlify.toml`)
4. Deploy!

## 📝 Notes for Playground

This application was developed as a demonstration of modern web development practices, specifically for consideration by Playground. Key aspects of this implementation include:

- **Component Architecture**: Modular, reusable components with clear separation of concerns
- **Type Safety**: Comprehensive TypeScript integration throughout the codebase
- **Testing**: High test coverage with a focus on user interactions
- **Performance**: Optimized rendering and state management
- **Accessibility**: Built with accessibility best practices in mind

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
