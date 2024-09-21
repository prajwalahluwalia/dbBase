import unittest
from app import app

class FlaskAppTestCase(unittest.TestCase):

    def setUp(self):
        # Set up a test client
        self.app = app.test_client()
        self.app.config['TESTING'] = True

    def tearDown(self):
        # Clean up after tests (if needed)
        pass

    def test_home_page(self):
        # Test the home page
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Hello, World!', response.data)

    def test_invalid_route(self):
        # Test an invalid route
        response = self.app.get('/invalid')
        self.assertEqual(response.status_code, 404)

if __name__ == '__main__':
    unittest.main()
