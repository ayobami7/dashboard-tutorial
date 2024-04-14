import graphqlDataProvider, { GraphQLClient, liveProvider as graphqlLiveProvider } from '@refinedev/nestjs-query'; // Importing GraphQL data provider and related modules
import { fetchWrapper } from './fetch-wrapper'; // Importing fetchWrapper function from fetch-wrapper module
import { createClient } from 'graphql-ws'; // Importing createClient function from graphql-ws module

// Defining API base URLs
export const API_BASE_URL = 'https://api.crm.refine.dev';
export const API_URL = `${API_BASE_URL}/graphql`
export const WS_URL = 'wss://api.crm.refine.dev/graphql';

// Creating GraphQL client
export const client = new GraphQLClient(API_URL, {
    // Custom fetch function
    fetch: (url: string, options: RequestInit) => {
        try {
            // Attempting to fetch with fetchWrapper
            return fetchWrapper(url, options);
        } catch (error) {
            // If an error occurs, rejecting with the error
            return Promise.reject(error as Error);
        }
    }
});

// Creating WebSocket client if running in the browser environment
export const wsClient = typeof window !== "undefined" 
    ? createClient({
        // WebSocket URL
        url: WS_URL,
        // Connection parameters function to include access token in headers
        connectionParams: () => {
            const accessToken = localStorage.getItem('access_token'); // Retrieving access token from local storage

            return {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Setting Authorization header with access token
                },
            };
        },
    })
    : undefined;

// Creating GraphQL data provider using the GraphQL client
export const dataProvider = graphqlDataProvider(client);

// Creating live data provider using the WebSocket client, if available
export const liveProvider = wsClient ? graphqlLiveProvider(wsClient) : undefined;
