pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 10, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '5'))
    }

    triggers {
        // Checks GitHub for new commits every 2 minutes
        pollSCM('H/2 * * * *')
    }

    environment {
        DEPLOY_DIR = 'C:\\jenkins-test-env'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                bat 'node --version'
                bat 'npm --version'
                bat 'npm install'
            }
        }

        stage('Test') {
            steps {
                bat 'npm test'
            }
            post {
                always {
                    junit 'junit.xml'
                }
            }
        }

        stage('Package') {
            steps {
                bat 'if not exist dist mkdir dist'
                bat 'tar -czf dist\\app-%BUILD_NUMBER%.tar.gz app.js server.js smoke.js package.json'
                archiveArtifacts artifacts: 'dist/*.tar.gz', fingerprint: true
            }
        }

        stage('Deploy to Test') {
            steps {
                bat '''
                    if exist "%DEPLOY_DIR%" rmdir /s /q "%DEPLOY_DIR%"
                    mkdir "%DEPLOY_DIR%"
                    tar -xzf dist\\app-%BUILD_NUMBER%.tar.gz -C "%DEPLOY_DIR%"
                    cd /d "%DEPLOY_DIR%"
                    call npm install --omit=dev
                    node smoke.js
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline finished successfully.'
        }
        failure {
            echo 'Pipeline failed. Check the stage logs above.'
        }
    }
}
