import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { 한글함수 } from '../src/getSomething'
import { 한글컴포넌트 } from '../src/SomeComponent'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const 한글변수 = 한글함수();
  return (
    <div className={styles.container}>
      <한글컴포넌트 {...한글변수} />
    </div>
  )
}

export default Home
