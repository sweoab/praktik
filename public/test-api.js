// Test MSW directly in browser console
console.log('Testing MSW API endpoints...');

// Test the contacts endpoint
fetch('/api/data/contacts/contactsData')
  .then(response => {
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    return response.json();
  })
  .then(data => {
    console.log('API Response:', data);
  })
  .catch(error => {
    console.error('API Error:', error);
  });
