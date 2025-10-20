pipeline {
    agent any

    stages {
        stage('Instalar Dependências') {
            steps {
                bat 'npm install'
            }
        }
        
        stage('Subir Servidor (Background)') {
            steps {
                
                bat 'start /b npm start' 
                
                
                sleep 5 
            }
        }

        stage('Executar Testes') {
            steps {
                bat 'npm run cy:run' 
            }
        }
    }

    post {
        always {
            echo 'Encerrando processo do servidor...'
            
            bat 'taskkill /f /im node.exe || exit 0' 
        }
        success {
            echo 'Pipeline de Testes concluído com SUCESSO!'
        }
        failure {
            echo 'Pipeline de Testes falhou.'
        }
    }
}
