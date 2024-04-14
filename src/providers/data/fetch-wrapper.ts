import { GraphQLFormattedError } from 'graphql'; // Importing GraphQLFormattedError type from 'graphql' module

// Defining Error type
type Error = {
    message: string;
    statusCode: string;
}

// Custom fetch function
const customFetch = async (url: string, options: RequestInit ) => {
    // Retrieving access token from local storage
    const accessToken = localStorage.getItem('access_token');

    // // Extracting headers from options
    const headers = options.headers as Record<string, string>; 

    // Making fetch request
    return await fetch(url, {
        ...options,
        headers: {
            ...headers,
            Authorization: headers?.Authorization || `Bearer ${accessToken}`, 
            "Content-Type": "application/json",
            "Apollo-Require-Preflight": "true",
        }
    })
}

// Function to extract GraphQL errors from response body
const getGraphQLErrors = (body: Record<"errors", GraphQLFormattedError[] | undefined>): Error | null => {
    // If body is null or undefined
    if (!body) {
        return {
            message: 'Unknown Error',
            statusCode: "INTERNAL_SERVER_ERROR"
        }
    }

    // If 'errors' property exists in body
    if ("errors" in body) {
        const errors = body?.errors;

        // Extracting error messages and code
        const messages = errors?.map((error) => error?.message)?.join("");
        const code = errors?.[0]?.extensions?.code;

        return {
            message: messages || JSON.stringify(errors), // Using JSON.stringify if messages are not available
            statusCode: code || 500 // Using code "500" as fallback for statusCode
        }
    }

    return null; // Returning null if no errors found
}

// Exporting fetchWrapper function
export const fetchWrapper = async (url: string, options: RequestInit) => {
    const response = await customFetch(url, options); // Performing fetch request

    const responseClone = response.clone(); // Cloning response
    const body = await responseClone.json(); // Parsing JSON body of response

    const error = getGraphQLErrors(body); // Extracting GraphQL errors from response body

    if (error) {
        throw error; // Throwing error if GraphQL errors are present
    }

    return response; // Otherwise returning the original response
};
