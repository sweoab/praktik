// Data Fetching Test Suite
import { getFetcher, postFetcher, putFetcher, deleteFetcher } from './globalFetcher.js';

class DataFetchingTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async runTest(name, testFunction) {
    try {
      console.log(`🧪 Testing: ${name}`);
      const result = await testFunction();
      this.results.passed++;
      this.results.tests.push({ name, status: 'PASS', result });
      console.log(`✅ ${name} - PASSED`);
      return result;
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name, status: 'FAIL', error: error.message });
      console.error(`❌ ${name} - FAILED:`, error.message);
      return null;
    }
  }

  async testContactsAPI() {
    await this.runTest('Get Contacts Data', async () => {
      const response = await getFetcher('/api/data/contacts/contactsData');
      if (!response || !response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response structure');
      }
      return `Found ${response.data.length} contacts`;
    });

    await this.runTest('Add New Contact', async () => {
      const newContact = {
        firstname: 'Test',
        lastname: 'User',
        email: 'test@example.com',
        phone: '123-456-7890',
        department: 'Testing',
        company: 'Test Co'
      };
      const response = await postFetcher('/api/data/contacts/addContact', newContact);
      return 'Contact added successfully';
    });
  }

  async testHealthEndpoint() {
    await this.runTest('Health Check Endpoint', async () => {
      const response = await getFetcher('/api/test/health');
      if (response.status !== 'ok') {
        throw new Error('Health check failed');
      }
      return response.message;
    });
  }

  async testErrorHandling() {
    await this.runTest('Non-existent Endpoint', async () => {
      try {
        await getFetcher('/api/non-existent');
        throw new Error('Should have failed but did not');
      } catch (error) {
        if (error.message.includes('Failed to fetch data')) {
          return 'Error handling working correctly';
        }
        throw error;
      }
    });
  }

  async runAllTests() {
    console.log('🚀 Starting Data Fetching Tests...\n');
    
    await this.testHealthEndpoint();
    await this.testContactsAPI();
    await this.testErrorHandling();

    console.log('\n📊 Test Results:');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📝 Total: ${this.results.tests.length}`);
    
    if (this.results.failed === 0) {
      console.log('🎉 All tests passed! Data fetching is working correctly.');
    } else {
      console.log('⚠️ Some tests failed. Check the errors above.');
    }

    return this.results;
  }
}

// Auto-run tests when script is loaded
window.DataFetchingTester = DataFetchingTester;
window.runDataTests = async () => {
  const tester = new DataFetchingTester();
  return await tester.runAllTests();
};

console.log('Data Fetching Test Suite loaded. Run window.runDataTests() to execute.');
