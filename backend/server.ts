import express from 'express'

// Constants
const port = process.env.PORT || 5173

// Create http server
const app = express()

// Serve HTML
app.use('*', async (req, res) => {
  res.status(200).send("hello");
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
