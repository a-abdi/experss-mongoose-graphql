import messages from '../messages'

/**
 * @function generalValidator
 * @description
 * @param {object} joiSchemaObject - joi schema
 * @return {function} - returns a middleware that directs request to next middleware if request data is valida according to joi schema
 */
export default (joiSchemaObject) => (req, res, next) => {
  try {
    const { body, query, params } = req,
      inputs = { ...body, ...query, ...params },
      { error } = joiSchemaObject.validate(inputs)

    if (error) {
      if (error.details[0].type === 'object.unknown')
        throw global.error(400, messages.m.FIELD_INCORRECT)
      throw global.error(400, error.details[0].message)
    }

    next()
  } catch (err) {
    next(err)
  }
}
