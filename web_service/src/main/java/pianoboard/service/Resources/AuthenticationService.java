package pianoboard.service.Resources;

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

import pianoboard.service.Requests.AuthorizationRequest;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.io.IOException;
import javax.naming.AuthenticationException;

@Path("/authentication")
public class AuthenticationService implements Service {

	private final CORSFilter filter = new CORSFilter();
	private final AccountActivity activity = new AccountActivity();

	public AuthenticationService() {}

	@GET
	@Path("/login")
	@Produces("application/json")
	public Response login(AuthenticationRequest auth, HttpServletRequest request) {
		try {
			return filter.addCORS(Response.ok(activity.authorize(auth.getUsername(), auth.getPassword(), request.getRemoteAddr())));
		} catch(AuthenticationException e) {
			return filter.addCORS(Response.status(401));
		} catch(JsonProcessingException e) {
			return filter.addCORS(Response.status(500));
		} catch(IOException e) {
			return filter.addCORS(Response.status(404));
		}
	}

	@GET
	@Path("/token")
	@Produces("application/json")
	public Response verifyToken(String token, HttpServletRequest request) {
		try {
			return filter.addCORS(Response.ok(activity.authorize(token, request.getRemoteAddr())));
		} catch(AuthenticationException e) {
			return filter.addCORS(Response.status(401));
		} catch(JsonProcessingException e) {
			return filter.addCORS(Response.status(500));
		} catch(IOException e) {
			return filter.addCORS(Response.status(404));
		}
	}
}
