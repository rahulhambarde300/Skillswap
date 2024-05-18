/** @type {import('next').NextConfig} */
const nextConfig = {  
    reactStrictMode: false,
    env: {
        UPSTASH_REDIS_REST_URL: "https://us1-aware-mastodon-39128.upstash.io",
        UPSTASH_REDIS_REST_TOKEN: "AZjYASQgOThhMTU5NzUtNjM3NS00ODFjLTk1YWEtNTljYmZlYjNmYmY3MTM5NjMyMWVkMzA0NGRkNDkzYWMyYjNlNTcwY2VhNWE="
    }
};

export default nextConfig;
