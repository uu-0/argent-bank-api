const express = require('express')
const dotEnv = require('dotenv')
const cors = require('cors')
//configuration de l'interface utilisateur Swagger
const swaggerUi = require('swagger-ui-express')
const yaml = require('yamljs')
const swaggerDocs = yaml.load('./swagger.yaml')
//configuration de la base de données
const dbConnection = require('./database/connection')

dotEnv.config() //charger les variables d'environnement

const app = express()
const PORT = process.env.PORT || 3001
//connexion à la base de données avec gestion des erreurs
dbConnection().catch(err => {
  console.error('Database connection failed:', err)
  process.exit(1) //quitter le processus si la connexion à la base de données échoue
})

//configuration du middleware
app.use(cors()) //gestion problèmes CORS
app.use(express.json()) //analyser les requêtes JSON entrantesAnalyser les requêtes codées par URL
app.use(express.urlencoded({ extended: true })) //analyser les requêtes codées par URL

//routes personnalisées pour le module Utilisateur
app.use('/api/v1/user', require('./routes/userRoutes'))

//fournir la documentation Swagger sur /api-docs (sauf en production)
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
}

//route par défaut avec un exemple de réponse
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Bank Argent API!',
    documentation: 'Visit /api-docs for API documentation',
    current_time: new Date().toISOString(),
  })
})

//middleware de gestion des erreurs pour les routes non définies
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

//démarrer le serveur sur le port spécifié
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
