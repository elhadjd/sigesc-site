import React from 'react'
import styles from '../../../assets/public/previewText.module.scss'
import { textPreviewTs } from '../home/Demonstration'
export default function TextPreview({preview,action}:{preview: textPreviewTs,action(state:string): void}) {
  return (
    <>
    {preview.state && (<div onClick={()=>action('false')} className={styles.principal}>
        <div>
            <p>{preview.content}</p>
        </div>
    </div>)}
    </>

  )
}
