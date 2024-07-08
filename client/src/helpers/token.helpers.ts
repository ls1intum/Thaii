import { jwtDecode, JwtPayload } from "jwt-decode";

export function isTokenExpired(token: string): boolean {
    try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        if (!decodedToken.exp) {
            throw new Error('Token does not have an expiration time.');
        }
        const currentTime = Math.floor(Date.now() / 1000);
        return decodedToken.exp < currentTime;
    } catch (error) {
        console.error('Error decoding token:', error);
        return true; // If there's an error, consider the token as expired
    }
}
