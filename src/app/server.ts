import morgan from 'morgan'
import express from 'express'
import { Express } from 'express-serve-static-core'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'

/**
 * Construct a schema, using GraphQL schema language
 */
var schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
  }
`)

/**
 *  The root provides a resolver function for each API endpoint
 */
var root = {
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within'
  },
  random: () => {
    return Math.random()
  },
  rollThreeDice: () => {
    return [1, 2, 3].map((_) => 1 + Math.floor(Math.random() * 6))
  },
}

export default class Server {
  private app = express()

  start(): void {
    this.configMiddlewares()
    this.runServer()
  }

  private configMiddlewares(): void {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(morgan('dev'))

    this.app.use(
      '/graphql',
      graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
      }),
    )
  }

  private runServer(): void {
    this.app.listen(3000, () => {
      console.log('Server listen on port %d', 3000)
    })
  }

  getApp(): Express {
    return this.app
  }
}
