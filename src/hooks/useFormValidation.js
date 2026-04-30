import { useState, useCallback } from 'react'

export const useFormValidation = (validationRules) => {
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validateField = useCallback((name, value) => {
    const rules = validationRules[name]
    if (!rules) return ''

    if (rules.required) {
      if (typeof value === 'boolean' && !value) return rules.message
      if (!value || (typeof value === 'string' && !value.trim())) return rules.message
    }

    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      return rules.message
    }
    
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      return rules.message
    }

    return ''
  }, [validationRules])

  const validateForm = useCallback((formData) => {
    const newErrors = {}
    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, formData[field])
      if (error) newErrors[field] = error
    })
    return newErrors
  }, [validateField, validationRules])

  const touchField = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }))
  }, [])

  const touchAll = useCallback(() => {
    const allTouched = Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {})
    setTouched(allTouched)
  }, [validationRules])

  return {
    errors,
    setErrors,
    touched,
    validateField,
    validateForm,
    touchField,
    touchAll
  }
}