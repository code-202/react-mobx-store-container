import * as React from 'react'
import { observer, inject, Provider } from 'mobx-react'
import StoreContainer from './store-container'
import StoreFactory from './store-factory'

interface Props extends React.PropsWithChildren {
    names: (string | StoreFactory | (() => string) | (() => StoreFactory))[],
    container?: StoreContainer,
    factories?: { [id: string]: { (...dependencies: any[]): any }}
    dependencies?: { [id: string]: string[]}
}

interface State {}

class DynamicProvider extends React.Component<Props, State> {
    constructor (props: Props) {
        super(props)

        for (const name of this.props.names) {
            const reference = (typeof name === 'function') ? name() : name

            if (typeof reference === 'string') {
                if (this.props.container && !this.props.container.hasFactory(reference) && this.props.factories && this.props.factories[reference]) {
                    const creator = this.props.factories[reference]
                    const factory: StoreFactory = {
                        key: reference,
                        dependencies: this.props.dependencies && this.props.dependencies[reference] ? this.props.dependencies[reference] : [],
                        create: (...dependencies: any[]) => creator(...dependencies)
                    }

                    this.props.container.addFactory(factory)
                    this.props.container.get(reference)
                }
            } else {
                if (this.props.container) {
                    this.props.container.addFactory(reference as StoreFactory)
                    this.props.container.get(reference.key)
                }
            }
        }
    }

    render () {
        const stores: {[key: string]: any} = {}

        for (const name of this.props.names) {
            const reference = (typeof name === 'function') ? name() : name
            const key: string = (typeof reference === 'string') ? reference : reference.key

            if (!this.props.container || !this.props.container.has(key)) {
                return <></>
            }

            stores[key] = this.props.container.get(key)
        }

        return (
            <Provider {...stores}>
                {React.Children.only(this.props.children)}
            </Provider>
        )
    }
}

export default inject('container')(observer(DynamicProvider))
