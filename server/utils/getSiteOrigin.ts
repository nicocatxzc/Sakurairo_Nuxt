// 获取来源地址
import type { H3Event,EventHandlerRequest } from 'h3'

export default function getSiteOrigin(event:H3Event<EventHandlerRequest>) {
    const url = getRequestURL(event);

    return {
        baseURL: url.origin,
        protocol: url.protocol.replace(":", ""),
        host: url.host,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        fullUrl: url.toString(),
    };
}
