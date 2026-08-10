import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})                                     //The service is responsible for the actual logic and data regarding authentication.
// It doesn't decide if you can see a page; it just provides the tools to check who you are.
export class AuthService {

  private tokenKey = 'auth_token';
  private isLoggedIn = false;

  private authStatus = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {
  }

  login(credentials: { email: string; password: string }): Observable<boolean> {
    return this.http.post<any>(`${environment.IP_LOGIN}`, credentials).pipe(
      map(response => {
        const token = response?.payload?.data?.token;

        if (!token) {
          throw new Error('Token missing in response');
        }

        localStorage.setItem(this.tokenKey, token);
        this.authStatus.next(true);
        return true; // emit true only if login succeeded
      })
      // ⚠️ no catchError here – let the error propagate!
    );
  }


  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.authStatus.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    return token;
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(window.atob(payloadBase64));

      // Return the role (Optional: force lowercase to avoid case-sensitivity issues)
      return decodedPayload.role ? decodedPayload.role.toString().toLowerCase() : null;

    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }


  // Helper to access the current user's data from the token
  public get currentUserValue(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      // Decode the token payload
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(window.atob(payloadBase64));

      // Return the user data (payload)
      // Note: Make sure your Backend puts firstName/lastName in the JWT token!
      // If not, you might need to fetch the profile from an API endpoint instead.
      return decodedPayload;
    } catch (e) {
      return null;
    }
  }

  // getRole(): string | null {
  //   const token = this.getToken();
  //
  //   if (!token) {
  //     console.warn("DEBUG: No token found in localStorage.");
  //     return null;
  //   }
  //
  //   try {
  //     // 1. Split the token
  //     const parts = token.split('.');
  //     console.log("DEBUG: Token parts count:", parts.length);
  //
  //     // 2. Extract the payload (middle part)
  //     const payloadBase64 = parts[1];
  //     console.log("DEBUG: Raw Base64 Payload:", payloadBase64);
  //
  //     // 3. Decode Base64 to String
  //     const decodedString = window.atob(payloadBase64);
  //     console.log("DEBUG: Decoded JSON String:", decodedString);
  //
  //     // 4. Parse to Object
  //     const payloadObj = JSON.parse(decodedString);
  //     console.log("DEBUG: Full Payload Object:", payloadObj);
  //
  //     // 5. Check for role
  //     if (payloadObj && payloadObj.role) {
  //       console.log("DEBUG: Role found:", payloadObj.role);
  //       return payloadObj.role;
  //     } else {
  //       console.warn("DEBUG: Role field missing in payload.");
  //       return null;
  //     }
  //
  //   } catch (e) {
  //     console.error("DEBUG: Decoding failed!", e);
  //     return null;
  //   }
  // }
  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}
