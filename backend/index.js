const { app, connectDB } = require('./server');

const port = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
});
