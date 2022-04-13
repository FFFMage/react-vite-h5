import React from 'react'
import Header from '@/components/Header'

import sty from './style.module.less'

export default function About() {
  return (
    <>
      <Header title="关于我的" />
      <div className={sty.about}>
        <div className={sty.item}>
          <h2>关于项目</h2>
          <span>计算机科学技术2001-203101940125-张明舟</span>
        </div>
        <div className={sty.item}>
          <h2>关于作者</h2>
          <span>计算机科学技术2001-203101940125-张明舟</span>
        </div>
      </div>
    </>
  )
}
