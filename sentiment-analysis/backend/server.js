import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { access, constants } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Middleware untuk logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const isWindows = process.platform === 'win32';
const pythonCommand = isWindows ? 'python' : 'python3';

app.post('/analyze', async (req, res) => {
  const { imdb_url } = req.body;
  
  if (!imdb_url) {
    return res.status(400).json({ 
      success: false, 
      error: 'URL is required' 
    });
  }

  // Validasi URL IMDb
  if (!imdb_url.match(/https?:\/\/www\.imdb\.com\/title\/tt\d+\/reviews\/?/)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid IMDb URL format. Example: https://www.imdb.com/title/tt1234567/reviews/'
    });
  }

  console.log("Processing URL:", imdb_url);
  
  try {
    // Verifikasi file scraping.py ada
    const scrapingScriptPath = join(__dirname, 'scraping.py');
    await access(scrapingScriptPath, constants.F_OK);
    
    exec(`${pythonCommand} "${scrapingScriptPath}" "${imdb_url}"`, { 
      cwd: __dirname,
      maxBuffer: 1024 * 1024 * 5 // 5MB buffer size
    }, (error, stdout, stderr) => {
      if (error) {
        console.error('Execution error:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Script execution failed',
          details: stderr || error.message
        });
      }
      
      if (stderr) {
        console.warn('Script warnings:', stderr);
      }

      try {
        const result = JSON.parse(stdout);
        if (result.error) {
          throw new Error(result.error);
        }
        
        console.log("Analysis completed. Reviews:", result.total_reviews);
        res.json({ 
          success: true,
          result: {
            positive: result.positive_percent,
            negative: result.negative_percent,
            total: result.total_reviews,
            sample_reviews: result.sample_reviews || []
          }
        });
      } catch (parseError) {
        console.error('Parse error:', parseError);
        res.status(500).json({ 
          success: false, 
          error: 'Result parsing failed',
          details: parseError.message,
          rawOutput: stdout
        });
      }
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`CORS enabled for: http://localhost:5173`);
  console.log(`Python command: ${pythonCommand}`);
  console.log(`Current directory: ${__dirname}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});