// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    api:'http://127.0.0.1:8000/api/v1',
    // api:' https://ba2a-102-89-34-180.ngrok-free.app/api/v1',
    AES_SECRET_KEY:"XXXX-XXXX-XXXX-XXXX",
    LIVE_PAYSTACK_SECRET_KEY: "sk_live_2343f2d1b4a7e9ef17daeec2a61d0565fdcc9de1",
    LIVE_PAYSTACK_PUBLIC_KEY: "pk_live_8eed2192654877caff4f8679229f884e1b93c35f",
    TEST_PAYSTACK_SECRET_KEY: "sk_test_4c18e79c7f6675bb9cfb9ffdc82faa65a024b12f",
    TEST_PAYSTACK_PUBLIC_KEY: "pk_test_61f9d0b56eef3ea3009d927bd82e71b57405957f",
    PAYSTACK_EMAL: "ekoemmanuelgodcoder@gmail.com",
    PAYSTACK_PASSWORD: "@10111011QWEqwe",
    BECOME_VENDOR_PLANS:{basic:1499,super:4499,elite:8499}
  };
  
  /*
   * For easier debugging in development mode, you can import the following file
   * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  // import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
  