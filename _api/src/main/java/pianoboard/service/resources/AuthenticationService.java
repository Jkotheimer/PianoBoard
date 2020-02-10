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
import javax.ws.rs.core.Response;
import javax.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Map;

import pianoboard.service.requests.*;
import pianoboard.service.activities.AccountActivity;
import pianoboard.domain.account.Token;

import java.io.IOException;
import javax.naming.AuthenticationException;
import javax.security.auth.login.CredentialExpiredException;

@Path("/authentication")
public class AuthenticationService extends Service {

	private final CORSFilter filter = new CORSFilter();
	private final AccountActivity activity = new AccountActivity();

	public AuthenticationService() {}

	@POST
	@Path("/login")
	@Produces("application/json")
	public Response login(AccountRequest auth, HttpServletRequest request) {

		String IP = getClientIp(request);
		System.out.println("POST REQUEST ON /authentication/login - USER LOGIN INITIALIZED");
		System.out.println("Email: " + auth.getEmail() + "\nPassword: " + auth.getPassword() + "\nIP: " + IP + "\n");

		try {
			// Returns a token to the client if the authentication goes through
			return filter.addCORS(Response.status(201).entity(activity.authenticateLogin(auth.getEmail(), auth.getPassword(), IP)));
		} catch(AuthenticationException e) {
			return filter.addCORS(Response.status(401));
		} catch(IOException e) {
			return filter.addCORS(Response.status(404));
		}
	}

	@POST
	@Path("/token")
	@Produces("application/json")
	public Response verifyToken(@HeaderParam("authentication") TokenRequest token, HttpServletRequest request) {

		System.out.println("POST REQUEST ON /authentication/token - USER VERIFICATION INITIALIZED");
		System.out.println("token: " + token.getToken() + "\n");
		try {
			// Returns a refreshed token to the client if the authentication passes
			return filter.addCORS(Response.status(201).entity(activity.refreshToken(token.getAccountID(), token.getToken(), getClientIp(request))));
		} catch(AuthenticationException e) {
			return filter.addCORS(Response.status(401).entity(e.getMessage()));
		} catch (CredentialExpiredException e) {
			return filter.addCORS(Response.status(401).entity(e.getMessage()));
		}
	}
}
