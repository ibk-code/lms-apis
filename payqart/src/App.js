import React, { Fragment, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './sass/main.scss'

const Home = lazy(() => import('./screens/home/home'))

function App() {
  return (
    <Fragment>
      <Suspense fallback={<div>Loading...</div>}>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
          </Switch>
        </Router>
      </Suspense>
    </Fragment>
  )
}

export default App
