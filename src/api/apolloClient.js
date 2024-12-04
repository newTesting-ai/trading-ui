import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

// HTTP Link for Queries and Mutations
const httpLink = new HttpLink({
  uri: 'http://localhost:5000/graphql', // Replace with your GraphQL HTTP endpoint
});

// WebSocket Link for Subscriptions
const wsLink = new WebSocketLink({
  uri: 'wss://singularly-bright-bonefish.ngrok-free.app/graphql', // Replace with your GraphQL WebSocket endpoint
  options: {
    reconnect: true, // Automatically reconnect if the connection drops
  },
});

// Split traffic based on operation type (Query/Mutation vs Subscription)
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink, // Use WebSocket link for subscriptions
  httpLink // Use HTTP link for queries and mutations
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(), // Cache for better performance
});

export default client;
