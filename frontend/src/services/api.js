const API_URL = import.meta.env.VITE_API_URL;

export const fetchGraphQL = async (query, variables = {}) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    const result = await res.json();
    if (result.errors) {
      console.error('GraphQL Errors:', result.errors);
      throw new Error(result.errors[0].message);
    }

    return result.data;
  } catch (err) {
    console.error('API error:', err);
    throw err;
  }
};
