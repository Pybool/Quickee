# Cypress Test Suite

This project contains cypress end-to-end tests using for the Reservation and Booking environments.

## Prerequisites

Before running the tests, make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)

## Installation

```bash
git clone <repository-url>
cd <project-directory>
npm install
```
## Environment Variables (.env)

Ensure you have the following environment variables set in your `.env` file:

```env
TESTRAIL_USERNAME=''
TESTRAIL_PASSWORD=''
TESTRAIL_URL=''
TESTRAIL_PROJECTID=''
TESTRAIL_PLAN=''
TESTRAIL_SUITEID=''
APIKEY=''
```

## Configurations

Make sure to set the following configuration parameters in your `cypress.env.json` file:

```json
{
  "EXPIAN-USERNAME": "",
  "EXPIAN-PASSWORD": "",
  "BOOKING": "https://booking.default-qa8.ticknovate-test.com/",
  "RESERVATION": "https://reservations.default-qa8.ticknovate-test.com/",
  "SERVER_BASE_URL": "",
  "TEST_DOWNLOADS_FOLDER": "",
  "ORDER_DAYS_FROM_TODAY": 1,
  "TEST_PRODUCT": "Taye Test Event"
}
```


## Running Tests
To run the Cypress tests:

```bash
npx cypress run
```

## Running Tests on Specific Environments
To run tests on a specific environment (e.g., Bookings):

```bash
npx cypress run --env Bookings
```

## Viewing Test Results
After running the tests, Cypress will generate reports and screenshots in the cypress/reports directory.

For additional configurations and options, refer to the Cypress documentation.

TestRail Integration
This project includes scripts to interact with TestRail.

## Delete All Sections/Folders in TestRail
```bash
node testrail.js --delete
```
## Initialize Top-Level Environment Sections/Folders on TestRail
```bash
node testrail.js --init
```
## Add Sub Sections to Top-Level Folders
```bash
node testrail.js --createsubdirs
```
## Export Tests to Selected Environment
To export tests to a selected environment (e.g., Reservations):

```bash
node testrail.js --export --Reservations
```
## Export and Clear Reports Folder
To export tests to a selected environment and clear the cypress/cucumber-json reports folder after export:

```bash
node testrail.js --export --Reservations cleandir
```
Feel free to customize the README further based on your specific project structure and requirements.
