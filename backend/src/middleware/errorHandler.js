export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: Object.values(err.errors).map(error => error.message),
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      error: 'This email is already registered',
    });
  }

  res.status(500).json({
    error: 'Something went wrong',
  });
};