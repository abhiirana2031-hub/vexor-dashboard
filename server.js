import express from 'express'
import { MongoClient, ObjectId } from 'mongodb'
import multer from 'multer'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.set('trust proxy', true) // Required for correct 'https' detection on Render/proxies
const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_DB || 'vexora'

let mongoClient
let db

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Serve static files
const distPath = path.join(__dirname, 'dist')
if (fs.existsSync(distPath)) {
  console.log('✓ Serving static files from:', distPath)
  app.use(express.static(distPath))
}

const uploadsPath = path.join(__dirname, 'public/uploads')
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true })
}
app.use('/uploads', express.static(uploadsPath))

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
})

// MongoDB Connection
async function connectDB() {
  if (mongoClient) return db

  try {
    mongoClient = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
    })

    await mongoClient.connect()
    db = mongoClient.db(MONGODB_DB)
    console.log('✓ Connected to MongoDB:', MONGODB_DB)
    return db
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message)
    throw error
  }
}

// Get collection with error handling
function getCollection(collectionId) {
  if (!db) throw new Error('Database not initialized')
  return db.collection(collectionId)
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', db: db ? 'connected' : 'disconnected' })
})

// Upload Endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  
  // Return relative URL for maximum portability across local/dev/prod environments
  const url = `/uploads/${req.file.filename}`
  
  res.json({ url })
})

// GET all items with pagination
app.get('/api/cms/:collectionId', async (req, res) => {
  try {
    const { collectionId } = req.params
    const limit = Math.min(parseInt(req.query.limit) || 50, 1000)
    const skip = parseInt(req.query.skip) || 0

    const collection = getCollection(collectionId)
    const totalCount = await collection.countDocuments()
    const items = await collection
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray()

    res.json({
      items,
      totalCount,
      hasNext: skip + limit < totalCount,
      currentPage: Math.floor(skip / limit),
      pageSize: limit,
      nextSkip: skip + limit < totalCount ? skip + limit : null,
    })
  } catch (error) {
    console.error('GET error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET single item by ID
app.get('/api/cms/:collectionId/:itemId', async (req, res) => {
  try {
    const { collectionId, itemId } = req.params

    const collection = getCollection(collectionId)
    
    // Try to handle ObjectId if it's a valid hex string, otherwise use string id
    let queryId;
    try {
      queryId = itemId.length === 24 && /^[0-9a-fA-F]{24}$/.test(itemId) 
        ? new ObjectId(itemId) 
        : itemId;
    } catch {
      queryId = itemId;
    }

    const item = await collection.findOne({ _id: queryId })

    if (!item) {
      return res.status(404).json({ error: 'Not found' })
    }

    res.json(item)
  } catch (error) {
    console.error('GET by ID error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST create item
app.post('/api/cms/:collectionId', async (req, res) => {
  try {
    const { collectionId } = req.params
    const itemData = req.body

    const collection = getCollection(collectionId)
    const result = await collection.insertOne({
      ...itemData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const newItem = await collection.findOne({ _id: result.insertedId })
    res.status(201).json(newItem)
  } catch (error) {
    console.error('POST error:', error)
    res.status(500).json({ error: error.message })
  }
})

// PATCH update item
app.patch('/api/cms/:collectionId/:itemId', async (req, res) => {
  try {
    const { collectionId, itemId } = req.params
    const itemData = req.body

    // Remove _id from update data to avoid conflicts
    const { _id, ...updateData } = itemData

    const collection = getCollection(collectionId)
    console.log(`[DB] Updating ${collectionId}:${itemId}`)
    
    // Try to handle ObjectId if it's a valid hex string, otherwise use string id
    let queryId;
    try {
      queryId = itemId.length === 24 && /^[0-9a-fA-F]{24}$/.test(itemId) 
        ? new ObjectId(itemId) 
        : itemId;
    } catch {
      queryId = itemId;
    }

    const result = await collection.findOneAndUpdate(
      { _id: queryId },
      {
        $set: {
          ...updateData,
          _updatedDate: new Date(),
        },
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      return res.status(404).json({ error: 'Not found' })
    }

    res.json(result.value || result)
  } catch (error) {
    console.error('PATCH error:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE item
app.delete('/api/cms/:collectionId/:itemId', async (req, res) => {
  try {
    const { collectionId, itemId } = req.params

    const collection = getCollection(collectionId)
    console.log(`[DB] Deleting ${collectionId}:${itemId}`)

    // Try to handle ObjectId if it's a valid hex string, otherwise use string id
    let queryId;
    try {
      queryId = itemId.length === 24 && /^[0-9a-fA-F]{24}$/.test(itemId) 
        ? new ObjectId(itemId) 
        : itemId;
    } catch {
      queryId = itemId;
    }

    const result = await collection.findOneAndDelete({ _id: queryId })

    if (!result) {
      return res.status(404).json({ error: 'Not found' })
    }

    res.json(result.value || result)
  } catch (error) {
    console.error('DELETE error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Catch-all route to serve React app
if (fs.existsSync(distPath)) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n✓ Shutting down...')
  if (mongoClient) {
    await mongoClient.close()
  }
  process.exit(0)
})

// Start server
async function start() {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`✓ Server running at http://localhost:${PORT}`)
      console.log(`✓ API base URL: http://localhost:${PORT}/api/cms`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

start()
