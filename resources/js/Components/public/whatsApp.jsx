import React from 'react'
import styles from '../../../assets/buttons/whatsApp.module.scss'
import { BsWhatsapp } from 'react-icons/bs'
import { Link } from '@inertiajs/react'
export default function WhatsApp() {
  return (
    <div className={styles.whatsApp}>
      <a href='https://wa.me/+244929147445' target="_blank">
        <BsWhatsapp/>
        WhatsApp
      </a>
    </div>
  )
}
