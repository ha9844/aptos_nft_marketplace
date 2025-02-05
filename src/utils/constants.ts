export const NFT_STORAGE_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_KEY!;
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export const MARKET_NAME = process.env.NEXT_PUBLIC_MARKET_NAME!;
export const MARKET_ADDRESS = process.env.NEXT_PUBLIC_MARKET_ADDRESS!;
export const MARKET_COINT_TYPE = process.env.NEXT_PUBLIC_MARKET_COIN_TYPE!;

export const APTOS_NODE_URL = process.env.NEXT_PUBLIC_APTOS_NODE_URL!;
export const APTOS_FAUCET_URL = process.env.NEXT_PUBLIC_APTOS_FAUCET_URL!;

export const API_ENDPOINT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api"
    : "https://backend.vexpy.com/api";

// export const API_ENDPOINT =
//   process.env.NODE_ENV === "development"
//     ? "http://194.163.159.220:3003/api"
//     : "https://backend.vexpy.com/api";

// export const API_ENDPOINT = "https://backend.vexpy.com/api";
export const DEFAULT_IMG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAO0AAADVCAMAAACMuod9AAAAXVBMVEXv7+9mZmbs7OxfX1/39/d+fn6np6fX19fz8/POzs55eXlbW1uDg4PS0tJkZGRhYWFqamrn5+eLi4tWVlbh4eGUlJSqqqqhoaH7+/u+vr5vb2/Jycm/v7+Ojo6wsLDYus8vAAADXElEQVR4nO3b6XLiOhCGYWshtG0siWVCljNz/5c5LQhhiWAyFacO8rzPv2Bw1eeW1LIJTQMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADcYMXKCKfRs4gd4TzfbT7MxzFUkFY6F3v3devYt2MMku/lZ6GbjWCR+uH+02ptR6mJLMY5z/eSbpQRKJq2itqOM99Ie39Ie4u91lUnmPZq1kmmFZHmSuDppZXN0G6ubIgnltbKZuvi2vzYSGlATyytn3frZFIMaVMq7sTSNj+jCSlq3lVT+MS00srcGZNCSsa4eeH4xNI+uxQ1qta3f55+bZ9dfNGwOpLjP5B23ufK5rjrtnC86rTiP7y0iPu0oZtWB7LWv66WFyuvH2La5Q2vpVgVp/Wvyc2Wl28dOuN699L6afVbaVN86WcXoazY/349vi7FyuWFaCpOK63J3SZ254+areb1XrfJxTuhWtP6IUQTc9zZ6cv27W7A7p6V7+prT26IKk0rw9vau1t9S5tEtRvOZ3d/daaVoQ+HtMl11743kW0n9ddW2vAeVjeJujIXM/itc4s8pt9fqTGtNtWYjrUtxc3zVx7WenOwypU91LfCtNp6jpXdi7O8zThZh2VpZRvy3Har/PfbgerSWhlMNJfiru+edZ0HF0Me5+uf9n2pri6tb81lZQ9xT3usf3RBB7ne2afdYN5/vLa0MiQX0se0eWU+dCLJq3EurDbkoIl1MNva0tpcOh3GpcruqtsdMlldjU/fFsLK79eputLqpuLjnD1w3X52Wvu07c/f5xa+vrR+cLEwio/V3Rc3h81z9jjMjVlIPlRTWtGw17O+x9VNRZ7Zx+uSH7m6RS58NWlz67md1bz13e2Hqa25damSmtLqLd4f0+oEXe777KWQd1X1fKPp2+RuzNlDFcNLviShlDeumlUlaeeD3rxfaz5nY1ZbbGEQpD7F+GPRz+8/re/MQxfMrfX4mLYs5EsVQ6ygtr5zn5izn1FDWulKm8Wppn3qPjGIJ5NW5+1ISHtv/r20I0zcVEva3sWv/3uynmJdQdrm18Moto/bzf8d5RPEy5MfQeEL3/sjdpxfP4zzY4zvZhu7zE8Uv2pZ/uYPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADg7/0G6cMyGr/MjwcAAAAASUVORK5CYII=";

export const ERROR_IMG =
  "https://res.cloudinary.com/vexpy/image/upload/img_zafcxz.webp";
export const CDN_URL = "https://res.cloudinary.com/vexpy/image/upload/";
export const CDN_REMOTE_URL = "https://res.cloudinary.com/vexpy/image/fetch/";
