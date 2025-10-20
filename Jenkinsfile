pipeline {
    agent any

    stages {
        stage('Clonar Repositório') {
            steps {
                
                checkout scm 
            }
        }

        stage('Instalar Dependências') {
            steps {
                sh 'npm install'
            }
        }

        stage('Subir Servidor (Background)') {
            steps {
                
                sh 'npm start &' 
                
                sh 'sleep 5' 
            }
        }

        stage('Executar Testes') {
            steps {
                
                sh 'npm run cy:run' 
            }
        }
    }

    
    post {
        always {
            
            echo 'Encerrando processo do servidor...'
            sh 'pkill -f "npm start"'
        }
        success {
            echo 'Pipeline de Testes concluído com SUCESSO! '
        }
        failure {
            echo 'Pipeline de Testes falhou. '
        }
    }
}
