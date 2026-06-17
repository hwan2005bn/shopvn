const requests = new Map<string, number[]>();

export function rateLimit(ip: string, max = 5, windowMs = 60000) {
    const now = Date.now();
    const userRequests = requests.get(ip) || [];
    const recent = userRequests.filter(t => now - t < windowMs);

    if (recent.length >= max) return false;

    recent.push(now);
    requests.set(ip, recent);
    return true;
}
