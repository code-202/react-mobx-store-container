export default interface StoreFactory {
    readonly key: string
    readonly dependencies: string[]
    create(...dependencies: any[]): any
}
