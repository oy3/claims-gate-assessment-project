# Claims Gate Developer Assessment Project

## Outline

This project is a part of the Claims Gate Developer Assessment. It involves creating a form component to collect an address history of up to 3 years from claimants. The project focuses on form validation, user experience enhancements, and responsive design using Vue.js, TypeScript, and Bootstrap.

## Features Implemented

- User Redirection if ID Not Found: The application checks for the user ID in the URL. If the user ID does not exist, a message is displayed, and the form does not load, ensuring that only existing users can proceed.

- Alert for Success and Error Handling: Implemented alerts to inform users of successful form submissions or errors during the process. This provides a clear and intuitive user experience.

- Additional Address Fields: Extra fields such as Address Line 2, City, State, and Date Moved Out have been included to capture more detailed address information.

- Postcode Autocomplete: Integrated with the api.postcodes.io to provide postcode suggestions as the user types. This feature enhances user experience by making it easier and faster to fill out the form.

- Validation for Address History: The form validates that the total address history provided by the user covers at least 3 years. It also checks the correctness of the move-in and move-out dates to ensure logical consistency.

- IP Address Retrieval: The user's IP address is fetched using the api.ipify.org API and stored along with the claim data.
- Submit Button Loader: A loader is displayed when the submit button is clicked, providing visual feedback to the user that their form is being processed. The loader also handles the button state, preventing multiple submissions.

- Responsive Design: The form is fully responsive, adapting to all screen sizes. The layout adjusts gracefully from large desktop screens to small mobile devices, ensuring a seamless experience across devices.


## Installation and Running the Project

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation
1) Clone the repository:

```
git clone https://github.com/yourusername/claims-gate-assessment.git
cd claims-gate-assessment
```

2) Install the dependencies:

```
npm install
```

### Running the Project
1) Start the development server:

```
npm run serve
```

2) Open your browser:

Navigate to http://localhost:8080/ to view the application.

### Building for Production
1) Build the project:

```
npm run build
```

2) Serve the built files:

You can use any static server to serve the files from the dist/ directory.

## Project Requirements

This project was built to meet the following requirements:

- Strong typing and usage of TypeScript throughout the project.
- DRY principles and consistent naming conventions.
- Responsive design with Bootstrap for all screen sizes.
- Integration with api.postcodes.io for postcode autocomplete.
- User validation and redirection based on user ID.
- Comprehensive form validation ensuring 3 years of address history.
- IP address retrieval using api.ipify.org.
- Loader on form submission to enhance user experience.

## Submission

This project has been completed and submitted as per the guidelines provided. The project is available in this repository and is ready for review.

If you have any questions or need further clarifications, please feel free to contact me.

