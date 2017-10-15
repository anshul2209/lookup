# API FOR INPATIENT PROSPECTIVE PAYMENT SYSTEMS PROVIDERS

Implementing an API that allows for various methods of querying the provider data, and a search page to show the results with mongodb database which stores this data

##Architecture

-The application use  Node Express API server in the backend. The frontend has been made using ReactJs.  
-The build folder with static assets is the output produced by Create React App in react-ui.  
-The requests to /provider are routed to the api call which calls the mongo database and executes the query and returns the result.   
-In production, we create the build and serve the ui as the static resource. We run the api in express to serve the queries.  

## Installing

```bash
git clone https://github.com/anshul2209/lookup.git
cd lookup/
npm install
cd react-ui/
npm install
cd ..
npm start-dev
```

## Running the tests

npm run test

## Deployment

The application has been deployed on Heroku(https://lookupprovider.herokuapp.com/).

## Acknowledgments

* https://github.com/facebookincubator/create-react-app
