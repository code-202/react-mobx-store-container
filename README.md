# react-mobx-store-container
Dynamic store to manage others stores (specialy usefull with react-loadable)

## Use

### Install StoreContainer

Create a `StoreContainer` in your main file to inject it in `Provider` tag (from `mobx-react`).

```
import * as React from 'react'
import { Provider } from 'mobx-react'
import { StoreContainer } from './lib/store-container'

export default class Bootstrap extends React.PureComponent<{}, {}> {
    private storeContainer: StoreContainer = new StoreContainer()

    render () {
        const stores = {
            container: this.storeContainer,
        }

        return (
            <Provider {...stores}>
                { /* ... */ }
            </Provider>
        )
    }
}

```

__Important__ : The StoreContainer must be inject in `Provider` with name 'container'.

### Use Dynamic Provider

Use `DynamiProvider` tag to provide Stores ifor children components. You have to use named stores. Add the store construction in `factories` attributes who will be use if the store does not exist in the StoreContainer.
```
import * as React from 'react'
import { DynamicProvider } from '../../lib/store-container'

// The store
import { WeatherStore } from './weather-store'

// The components who can access to the store
import Thermometer from './thermometer'
import HumiditySensor from './humidity-sensor'
import Nanometer from './nanometer'

export default class Home extends React.Component<{}, {}> {
    render () {
        return (
            <DynamicProvider names={['weather']} factories={{ weather: () => new WeatherStore() }}>
                <Thermometer />
                <HumiditySensor />
                <Nanometer />
            </DynamicProvider>
        )
    }
}

```
