import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('📚 Library API Server Started');
  console.log('='.repeat(40));
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`👤 Authors API: http://localhost:${PORT}/authors`);
  console.log(`📖 Books API: http://localhost:${PORT}/books`);
  console.log('='.repeat(40));
});