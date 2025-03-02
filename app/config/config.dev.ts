/**
 * These are configuration settings for the dev environment.
 *
 * Do not include API secrets in this file or anywhere in your JS.
 *
 * https://reactnative.dev/docs/security#storing-sensitive-info
 */
export default {
//   API_URL: "https://api.rss2json.com/v1/",

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
}
