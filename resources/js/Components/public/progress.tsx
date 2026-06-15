import React from 'react'
import styles from '../../../assets/progress/index.module.scss'
import {useFormState} from '../../contexts/stateForm'
export const Progress = ()=> {
  const {isFormSubmitted} = useFormState()
  return (
    <>
      {
        isFormSubmitted && (
          <div className={styles.formProgress}>
            <img src="img/loaded.gif" alt="" />
            <p>Aguarda por favor</p>
          </div>
        )
      }
    </>
  )
}
