// SWR fetcher function with improved error handling

const getFetcher = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errorData = await res.text();
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText} - ${errorData}`);
    }
    return await res.json();
  } catch (error) {
    console.error('GET Fetch Error:', error);
    throw error;
  }
};

const postFetcher = async (url, arg) => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(arg),
    });
    if (!res.ok) {
      const errorData = await res.text();
      throw new Error(`Failed to post data: ${res.status} ${res.statusText} - ${errorData}`);
    }
    return await res.json();
  } catch (error) {
    console.error('POST Fetch Error:', error);
    throw error;
  }
};

const putFetcher = async (url, arg) => {
  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(arg),
    });
    if (!res.ok) {
      const errorData = await res.text();
      throw new Error(`Failed to update data: ${res.status} ${res.statusText} - ${errorData}`);
    }
    return await res.json();
  } catch (error) {
    console.error('PUT Fetch Error:', error);
    throw error;
  }
};

const patchFetcher = async (url, arg) => {
  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(arg),
    });
    if (!res.ok) {
      const errorData = await res.text();
      throw new Error(`Failed to update data: ${res.status} ${res.statusText} - ${errorData}`);
    }
    return await res.json();
  } catch (error) {
    console.error('PATCH Fetch Error:', error);
    throw error;
  }
};

const deleteFetcher = async (url, arg) => {
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(arg),
    });
    if (!res.ok) {
      const errorData = await res.text();
      throw new Error(`Failed to delete data: ${res.status} ${res.statusText} - ${errorData}`);
    }
    return await res.json();
  } catch (error) {
    console.error('DELETE Fetch Error:', error);
    throw error;
  }
};

export { getFetcher, postFetcher, putFetcher, deleteFetcher, patchFetcher };
