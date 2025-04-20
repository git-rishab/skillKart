import React from 'react';
import AppRoute from './routes/AppRoute';
import { Notifications } from '@mantine/notifications';
import { Analytics } from '@vercel/analytics/react';
import './index.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider } from '@mantine/core';

function App() {
  return (
    <>
      <MantineProvider>
        <Notifications />
        <AppRoute />
        <Analytics />
      </MantineProvider>
    </>
  )
}

export default App
