package pianoboard.service.resources;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PATCH;
import javax.ws.rs.PUT;
import javax.ws.rs.DELETE;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.CookieParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Context;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.NewCookie;
import javax.naming.AuthenticationException;
import javax.security.auth.login.CredentialExpiredException;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import pianoboard.resources.Resources;
import pianoboard.service.requests.*;
import pianoboard.service.activities.AccountActivity;
import pianoboard.domain.account.Token;

@Path("/authentication")
public class AuthenticationService extends Service {

	private final CORSFilter filter = new CORSFilter();
	private final AccountActivity activity = new AccountActivity();

	public AuthenticationService() {}

	@POST
	@Path("/login")
	@Consumes("application/json")
	@Produces("application/json")
	public Response login(AccountRequest auth, @Context HttpServletRequestWrapper request) {

		String IP = getClientIp(request);
		System.out.println("POST REQUEST ON /authentication/login - USER LOGIN INITIALIZED");
		System.out.println("VERIFYING THAT " + auth.getEmail() + " HAS PASSWORD " + auth.getPassword());

		try {
			// Returns a token to the client if the authentication goes through
			Token token = activity.authenticateLogin(auth.getEmail(), auth.getPassword(), IP);
			NewCookie token_cookie = new NewCookie("pianoboard_token", token.getToken());
			NewCookie uid_cookie = new NewCookie("pianoboard_uid", token.getAccountID());
			return filter.addCORS(Response.status(201).cookie(token_cookie, uid_cookie));
		} catch(AuthenticationException e) {
			return filter.addCORS(Response.status(401));
		} catch(IOException e) {
			return filter.addCORS(Response.status(404));
		}
	}

	@POST
	@Path("/token")
	@Produces("application/json")
	public Response verifyToken(@CookieParam("pianoboard_token") String token,
								@CookieParam("pianoboard_uid") String ID,
								@Context HttpServletRequestWrapper request) {

		System.out.println("POST REQUEST ON /authentication/token - USER VERIFICATION INITIALIZED");
		System.out.println("VERIFYING THAT " + ID + " HAS TOKEN " + token);

		try {
			// Returns a refreshed token to the client if the authentication passes
			Token t = activity.authenticateToken(ID, token, getClientIp(request));
			NewCookie token_cookie = new NewCookie("pianoboard_token", t.getToken());
			NewCookie uid_cookie = new NewCookie("pianoboard_uid", t.getAccountID());
			return filter.addCORS(Response.status(201).cookie(token_cookie, uid_cookie));
		} catch(AuthenticationException e) {
			return filter.addCORS(Response.status(401).entity(e.getMessage()));
		} catch(CredentialExpiredException e) {
			return filter.addCORS(Response.status(401).entity(e.getMessage()));
		} catch(IOException e) {
			return filter.addCORS(Response.status(404).entity(e.getMessage()));
		}
	}

	@DELETE
	@Path("/token")
	@Produces("application/json")
	public Response logout(@CookieParam("pianoboard_token") String token,
						   @CookieParam("pianoboard_uid") String ID,
						   @Context HttpServletRequestWrapper request) {

		System.out.println("DELETE REQUEST ON /authentication/token - USER LOGOUT INITIALIZED");
		System.out.println("VERIFYING THAT " + ID + " HAS TOKEN " + token);

		try {
			activity.logout(ID, token, getClientIp(request));
			return filter.addCORS(Response.ok());
		} catch(AuthenticationException e) {
			return filter.addCORS(Response.status(401).entity(e.getMessage()));
		} catch(IOException e) {
			return filter.addCORS(Response.status(404).entity(e.getMessage()));
		} catch(CredentialExpiredException e) {
			// If the credentials are expired, the user is technically already logged out so we return an okay status
			return filter.addCORS(Response.ok());
		}
	}
}
