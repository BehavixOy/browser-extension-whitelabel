import BehavixSdk from 'behavix_sdk'

(async () => {
    await BehavixSdk.initialize("YOUR_API_KEY")

    // BehavixSdk.setUser({ user_id: 'set this' })

    // If your code requires interaction with BehavixSdk it should be inside this async block,
    // Alternatively you can chain BehavixSdk.initialize("APIKEY").then(() => { })
    // if you do not wish to use top level anonymous function.
})();
