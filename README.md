# jenkins-ci-demo

A small Node.js (Express) app with a Jenkins CI pipeline defined as code in the `Jenkinsfile`. Every push to GitHub triggers an automatic checkout, build, test, package and test deployment.

## Environment

- Windows 10 laptop
- Jenkins 2.580.2, installed from the Windows MSI and running as a service on port 8080
- Java (Eclipse Temurin 25), Git and Node.js installed on the same machine
- Plugins: Git, Pipeline, Timestamper, JUnit and Credentials, all from the suggested plugins set

## Pipeline stages

| Stage | What it does |
|---|---|
| Checkout | Pulls the latest code from this repository |
| Build | Prints the Node and npm versions and runs `npm install` |
| Test | Runs the Jest tests and publishes the results to Jenkins |
| Package | Creates `app-<build number>.tar.gz` and archives it as a build artifact |
| Deploy to Test | Unpacks the package into `C:\jenkins-test-env`, installs production dependencies and runs a health check against `/health` |

## Setup summary

1. Installed Java, Git and Node.js, then Jenkins from the MSI installer.
2. Created a Pipeline job using "Pipeline script from SCM", pointing at this repository on the `main` branch.
3. The job reads the `Jenkinsfile` from the repository root.

## Triggers

The job uses Poll SCM every two minutes. Jenkins runs on a local laptop, so GitHub webhooks cannot reach it. Polling gives the same result: a push to `main` starts a build without anyone clicking Build Now.

## Credentials

This repository is public, so Jenkins needs no credentials to clone it. For a private repository I would store a GitHub personal access token in Jenkins Credentials and select it in the job. Secrets are never written into the Jenkinsfile.

## Build history and troubleshooting

| Build | Result | Notes |
|---|---|---|
| #1 | Success | First run, started manually |
| #2 | Success | Started automatically after a README change |
| #3 | Success | I edited a test to make it fail, but the edit removed the assertion, so the test had nothing to check and passed |
| #4 | Failed | Test now expected the wrong greeting. Jest reported the expected and received values, the Test stage turned red, and Package and Deploy did not run |
| #5 | Success | Restored the correct expected value and the full pipeline passed |

Lesson from #3 and #4: a test without an assertion can never fail, and a failing Test stage stops the pipeline before anything is packaged or deployed.

## Screenshots

The `.png` files in this repository show the evidence:

- `1-stages-success.png 2`: all stages green on build #5
- `2-failed-console.png`: console output of failed build #4
- `3-failed-stages.png`: stage view of build #4 with the Test stage red
- `4-scm-trigger.png`: build #2 started by an SCM change
- `5-success-console.png`: console output ending in Finished: SUCCESS

## Run locally

```
npm install
npm test
npm start
```
