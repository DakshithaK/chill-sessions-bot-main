#!/usr/bin/env node

// Simple test script to verify Groq API connection
import fetch from 'node-fetch';
import dotenv from 'dotenv';

async function testGroqAPI() {
  console.log('🧪 Testing Groq API Connection...\n');
  
  // Load environment variables
  dotenv.config({ path: './backend/.env' });
  
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    console.log('❌ Groq API key not configured!');
    console.log('📝 Please:');
    console.log('   1. Go to https://console.groq.com/');
    console.log('   2. Sign up and get your API key');
    console.log('   3. Edit backend/.env and replace "your_groq_api_key_here" with your actual key');
    process.exit(1);
  }
  
  try {
    console.log('🔑 API Key found:', apiKey.substring(0, 10) + '...');
    console.log('🌐 Testing connection to Groq API...\n');
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant. Respond briefly and friendly.'
          },
          {
            role: 'user',
            content: 'Hello! Can you respond with just "Hi there! 👋" to test the connection?'
          }
        ],
        max_tokens: 50,
        temperature: 0.7,
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ API Error:', response.status, response.statusText);
      console.log('📄 Error details:', errorText);
      
      if (response.status === 401) {
        console.log('\n💡 This usually means your API key is invalid.');
        console.log('   Double-check your API key in backend/.env');
      } else if (response.status === 429) {
        console.log('\n💡 Rate limit exceeded. Try again in a moment.');
      }
      process.exit(1);
    }
    
    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;
    
    console.log('✅ Groq API connection successful!');
    console.log('🤖 AI Response:', aiResponse);
    console.log('\n🎉 Your therapy bot is ready to go!');
    console.log('\n🚀 Next steps:');
    console.log('   1. Start backend: cd backend && npm run dev');
    console.log('   2. Start frontend: npm run dev');
    console.log('   3. Open http://localhost:8080');
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   - Check your internet connection');
    console.log('   - Verify your API key is correct');
    console.log('   - Make sure you have a Groq account');
    process.exit(1);
  }
}

testGroqAPI();
