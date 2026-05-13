// Set test environment BEFORE any modules that read process.env are imported.
process.env.NODE_ENV = 'test';
process.env.AI_PROVIDER = 'groq';
process.env.GROQ_API_KEY = 'gsk_test_dummy_key_for_tests';
process.env.DATABASE_PATH = ':memory:';
process.env.LOG_LEVEL = 'fatal';
process.env.FRONTEND_URL = 'http://localhost:8080';
