# AI Workplace Productivity Assistant

## Project Overview

The **AI Workplace Productivity Assistant** is a modern web application designed to help professionals complete common workplace tasks more efficiently using Artificial Intelligence (AI).

The application provides tools for generating professional emails, communicating with an AI workplace assistant, and researching or summarising information. The goal of the project is to save time, improve communication, and make workplace tasks easier to manage.

## Features Implemented

### 1. Smart Email Generator

* Generates professional emails using AI.
* Supports different writing tones:

  * Formal
  * Friendly
  * Persuasive
* Allows users to provide a topic or instructions for the email.
* Produces ready-to-use email content.

### 2. AI Chatbot Interface

* Provides an interactive AI workplace assistant.
* Allows users to enter questions and workplace-related prompts.
* Provides AI-generated responses.
* Can assist with ideas, explanations, workplace tasks, and general productivity.

### 3. AI Research Assistant

* Allows users to enter a research topic or article.
* Summarises information into simpler and shorter content.
* Provides useful insights and recommendations.
* Helps users understand information more quickly.

### 4. Dashboard

* Provides a central location for accessing the application's features.
* Uses a modern and responsive interface.
* Makes navigation between the different AI tools simple and easy.

## Technologies and Tools Used

The project was developed using the following technologies and tools:

* **HTML5** – Used to create the structure of the web pages.
* **CSS3** – Used for styling, layout, and responsive design.
* **JavaScript** – Used to add interactivity and application functionality.
* **AI / Generative AI** – Used for email generation, chatbot responses, and research assistance.
* **Visual Studio Code** – Used as the development environment.
* **Git** – Used for version control.
* **GitHub** – Used to store and manage the project repository.

## Setup Instructions

### 1. Clone the Repository

Open a terminal or command prompt and run:

```bash
git clone https://github.com/your-username/your-repository-name.git
```

Replace `your-username` and `your-repository-name` with your GitHub username and repository name.

### 2. Open the Project

Navigate to the project folder:

```bash
cd your-repository-name
```

You can then open the project in Visual Studio Code:

```bash
code .
```

### 3. Configure the AI Service

If the application uses an external AI API, create or configure the required API key according to the AI service being used.

Do not upload private API keys or passwords to GitHub.

For example, sensitive information should be stored in an environment file:

```text
.env
```

The `.env` file should be added to `.gitignore` so that it is not uploaded to GitHub.

### 4. Run the Application

If the project is a basic HTML, CSS, and JavaScript application, open the main HTML file in a web browser.

Alternatively, use the **Live Server** extension in Visual Studio Code:

1. Open the project in Visual Studio Code.
2. Install the Live Server extension.
3. Right-click `index.html`.
4. Select **Open with Live Server**.
5. The application will open in your web browser.

If the project uses a framework or backend, install the required dependencies first:

```bash
npm install
```

Then start the development server:

```bash
npm run dev
```

## Project Structure

```text
AI-Workplace-Productivity-Assistant/
│
├── index.html
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
├── assets/
│   └── images/
│
├── .gitignore
└── README.md
```

## Usage

After launching the application, users can:

1. Open the dashboard.
2. Select the required AI productivity tool.
3. Enter their request or information.
4. Select the required options, such as email tone.
5. Generate an AI response.
6. Review, edit, and use the generated information.

## Purpose of the Project

The purpose of this project is to demonstrate how AI can be used to improve workplace productivity. It combines common workplace tasks into one application and provides users with simple AI-powered tools for communication, research, and general assistance.

## Future Improvements

Possible future improvements include:

* User accounts and authentication.
* Saving previous conversations and generated emails.
* Exporting emails and research summaries.
* Voice input and voice responses.
* Additional email tones and templates.
* Integration with email platforms.
* Improved AI personalisation.
* Mobile application support.
* Dark mode.

