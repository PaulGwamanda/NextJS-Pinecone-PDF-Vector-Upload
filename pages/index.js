// pages/index.js
import Head from 'next/head';
import styles from '../styles/Home.module.css';

import { useState } from 'react';
export default function Home() {
    const [setPdfText] = useState(null);

    const handleClick = async () => {
        try {
            const response = await fetch('/api/pdf-loader');
            if (response.ok) {
                const data = await response.json();
                setPdfText(data.text);
            } else {
                console.error('Error fetching PDF text:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching PDF text:', error.message);
        }
    };

    return (
    <div className={styles.container}>
      <Head>
        <title>Vector uploader</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>
            <span>Pincone Vector Uploader</span>  JS
        </h1>

        <p className={styles.description}>
            Add file location to your file here <code>./api/pdf-loader.js</code>
        </p>

        <div className={styles.grid}>
          <a onClick={handleClick} className={styles.card}>
            <h3>Submit </h3>
          </a>
        </div>
      </main>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
      `}</style>
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
