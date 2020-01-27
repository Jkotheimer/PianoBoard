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

import pianoboard.service.requests.AuthenticationRequest;
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
	public Response login(AuthenticationRequest auth, HttpServletRequest request) {

		String IP = getClientIp(request);
		System.out.println("POST REQUEST ON /authentication/login - USER LOGIN INITIALIZED");
		System.out.println("Email: " + auth.getEmail() + "\nUsername (should be null): " + auth.getUsername() + "\nPassword: " + auth.getPassword() + "\nIP: " + IP + "\n");
		try {
			return filter.addCORS(Response.ok(activity.authorize(auth.getEmail(), auth.getPassword(), IP)));
		} catch(AuthenticationException e) {
			return filter.addCORS(Response.status(401));
		} catch(IOException e) {
			return filter.addCORS(Response.status(500));
		}
	}

	@POST
	@Path("/token")
	@Produces("application/json")
	public Response verifyToken(Token token, HttpServletRequest request) {

		System.out.println("POST REQUEST ON /authentication/token - USER VERIFICATION INITIALIZED");
		System.out.println("token: " + token + "\n");
		try {
			return filter.addCORS(Response.ok(activity.authorize(token, getClientIp(request))));
		} catch(AuthenticationException e) {
			return filter.addCORS(Response.status(401));
		} catch (CredentialExpiredException e) {
			return filter.addCORS(Response.status(401));
		}
	}
}
