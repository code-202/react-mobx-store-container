import StoreContainer from '../src/store-container'
import StoreFactory from '../src/store-factory'

const container = new StoreContainer()

class Foo {
    get(): string {
        return 'bar'
    }
}

class Bar {
    get(): string {
        return 'foo'
    }
}

class NeedBar {
    protected bar: Bar

    constructor (bar: Bar) {
        this.bar = bar
    }

    get(): string {
        return this.bar.get()
    }
}

class Repeater {
    protected _msg: string = 'nothing'

    get(): string {
        return this._msg
    }

    set msg (v: string) {
        this._msg = v
    }

    deserialize(data: {msg: string}) {
        this._msg = data.msg
    }
}

class Loo {
    constructor(inter: Inter) {

    }
}

class Inter {
    constructor(ping: Ping) {

    }
}

class Ping {
    constructor(loo: Loo) {

    }
}

class Mad {
    constructor(mad: Mad) {

    }
}

test('test normal addStore', () => {
    container.addStore('foo', new Foo())

    expect(container.has('foo')).toBe(true)
    expect(container.get('foo').get()).toBe('bar')
})

test('test normal addFactory', () => {
    container.addFactory({
        key: 'bar',
        dependencies: [],
        create: () => new Bar()
    })

    expect(container.has('bar')).toBe(true)
    expect(container.ready('bar')).toBe(false)
    expect(container.hasFactory('bar')).toBe(true)

    const factory = container.getFactory('bar')
    expect(factory).toBeDefined()
    if (factory) {
        expect(factory.key).toBe('bar')
    }

    const store = container.get('bar')
    expect(store).toBeDefined()
    if (store) {
        expect(store.get()).toBe('foo')
    }

    expect(container.ready('bar')).toBe(true)
})

test('already got store', () => {
    container.addStore('foo', new Bar())
    container.addFactory({
        key: 'bar',
        dependencies: [],
        create: () => new Foo()
    })

    expect(container.get('foo').get()).toBe('bar')
    expect(container.get('bar').get()).toBe('foo')
})

test('factory with dependency', () => {
    container.addFactory({
        key: 'needBar',
        dependencies: ['bar'],
        create: (bar: Bar) => new NeedBar(bar)
    })

    expect(container.get('needBar').get()).toBe('foo')
})

test('factory unknown dependency', () => {
    container.addFactory({
        key: 'needUnknown',
        dependencies: ['bra'],
        create: (bar: Bar) => new NeedBar(bar)
    })

    expect(() => container.get('needUnknown')).toThrow('no dependency with key : bra')
})

test('factory with circular dependencies', () => {
    container.addFactory({
        key: 'loo',
        dependencies: ['inter'],
        create: (inter: Inter) => new Loo(inter)
    })
    container.addFactory({
        key: 'ping',
        dependencies: ['loo'],
        create: (loo: Loo) => new Ping(loo)
    })
    container.addFactory({
        key: 'inter',
        dependencies: ['ping'],
        create: (ping: Ping) => new Inter(ping)
    })

    expect(() => container.get('loo')).toThrow('cirular dependencies loo -> inter -> ping => loo')
})

test('factory with auto dependence', () => {
    container.addFactory({
        key: 'mad',
        dependencies: ['mad'],
        create: (mad: Mad) => new Mad(mad)
    })

    expect(() => container.get('mad')).toThrow('auto dependence mad => mad')
})

test('initialization of store', () => {

    container.addStore('repeater', new Repeater())

    expect(container.get('repeater').get()).toBe('nothing')

    container.deserialize({'repeater': { msg: 'bip'}})

    expect(container.get('repeater').get()).toBe('bip')
})

test('initialization of factory', () => {

    container.addFactory({
        key: 'bis',
        dependencies: [],
        create: () => new Repeater()
    })

    container.deserialize({'bis': { msg: 'bip'}})

    expect(container.get('bis').get()).toBe('bip')
})
