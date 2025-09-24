const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Jenkins CI/CD by kashyap' });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
}

module.exports = app;
