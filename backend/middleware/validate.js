// Generic Zod validation middleware factory
const { ZodError } = require('zod');

function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const data = req[source];
      const parsed = schema.parse(data);
      req.validated = req.validated || {};
      req.validated[source] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: 'ValidationError',
          issues: err.issues.map(i => ({ path: i.path, message: i.message }))
        });
      }
      next(err);
    }
  };
}

module.exports = { validate };