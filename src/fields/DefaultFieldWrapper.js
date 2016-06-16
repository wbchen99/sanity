import FormBuilderPropTypes from '../FormBuilderPropTypes'
import styles from './styles/Field.css'

import React, {PropTypes} from 'react'

export default function DefaultFieldWrapper(props, context) {

  const ValidationList = context.resolveValidationComponent()

  const validationClass = props.validation.messages.length > 0 ? styles.error : styles.valid
  const className = `${styles[`level_${props.level}`]} ${validationClass}`

  return (
    <div className={className}>
      <div className={styles.nestingLevel}>Field, nesting level {props.level}</div>
      <div className={styles.inner}>

        <label className={styles.label}>
          {props.field.title}
        </label>

        {
          props.field.description
          && <div className={styles.description}>
            {props.field.description}
          </div>
        }

        <div className={styles.content}>
          {props.children}
        </div>

        <ValidationList {...props.validation} />
      </div>
    </div>
  )
}

DefaultFieldWrapper.contextTypes = {
  resolveValidationComponent: PropTypes.func
}

DefaultFieldWrapper.propTypes = {
  children: PropTypes.node,
  role: PropTypes.string,
  level: PropTypes.number,
  label: PropTypes.string,
  title: PropTypes.string,
  field: PropTypes.object,
  validation: PropTypes.shape(FormBuilderPropTypes.validation)
}
