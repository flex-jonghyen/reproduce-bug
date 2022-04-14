import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { getSomething } from '../src/getSomething'
import { SomeComponent } from '../src/SomeComponent'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const props = getSomething();
  return (
    <div className={styles.container}>
      <SomeComponent {...props} />
    </div>
  )
}

export default Home
