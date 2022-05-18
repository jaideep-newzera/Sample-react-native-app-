const { ApolloServer, gql } = require('apollo-server');
const sql=require("./mysqconn.js")
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
type Account{
  Name: String
  Bio: String
  Photo: String
  id: ID
}
  type Query {
    Accounts(id: ID!): [Account]!
  }
  type Mutation {
    updateprofilepic(id: ID!,Photo: String): Account
  }
`;
  const resolvers = {
      Query: {
          Accounts: async (parent, args, context, info) => {
            const result = await sql("SELECT * FROM Account WHERE id = '" +  args.id + "' ;")
            return result;
          }
      },
      Mutation: {
          updateprofilepic: async (parent, args,context, info) => {
           await sql("UPDATE Account SET Photo = '" + args.Photo + "'WHERE id = '" + args.id + "' ;");
            const result = await sql("SELECT * FROM Account WHERE id = '" +  args.id + "' ;");
            return JSON.parse(JSON.stringify(result[0]));
          }
      }

  };
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});