import React from 'react';
import AppRoute from './routes/AppRoute';
import './index.css';
import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';

function App() {
  return (
    <>
      <MantineProvider>
        <AppRoute />
      </MantineProvider>
    </>
  )
}

export default App
