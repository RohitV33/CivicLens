// ============================================================
// middleware/validate.js - ZOD INPUT VALIDATION MIDDLEWARE
// ============================================================

export const validate = (schema, source = "body") => {
  return async (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const parsedData = await schema.parseAsync(dataToValidate);
      req[source] = parsedData; // Replace with sanitized & typed data
      next();
    } catch (error) {
      if (error.name === "ZodError" || error.errors) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(422).json({
          success: false,
          message: "Validation Error: Invalid input parameters",
          errors: formattedErrors,
        });
      }
      next(error);
    }
  };
};

export default validate;
