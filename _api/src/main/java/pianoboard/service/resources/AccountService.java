package pianoboard.service.resources;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.PATCH;
import javax.ws.rs.DELETE;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.CookieParam;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.NewCookie;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.IOException;
import javax.naming.AuthenticationException;

import pianoboard.resources.Resources;
import pianoboard.domain.account.Token;
import pianoboard.service.activities.AccountActivity;
import pianoboard.service.representations.AccountRepresentation;
import pianoboard.data_access.account.AccountAccessor;
import pianoboard.service.requests.AccountRequest;

@Path("/users")
public class AccountService extends Service {

	private AccountActivity activity = new AccountActivity();
	private CORSFilter filter = new CORSFilter();

	public AccountService() {}

	/**
	 * CREATE
	 * ________________________________________________________________________
	 */
	@POST
	@Consumes("application/json")
	@Produces("application/json")
	public Response createAccount(AccountRequest a, HttpServletRequestWrapper request) {

		String IP = getClientIp(request);
		System.out.println("POST REQUEST TO /users: ACCOUNT CREATION INITIALIZED");
		System.out.println("ACCOUNT BEING CREATED WITH EMAIL " + a.getEmail() + " AND PASSWORD " + a.getPassword() + " FROM IP " + IP);

		try {
			Token t = activity.create(a.getEmail(), a.getPassword(), IP);
			NewCookie token_cookie = new NewCookie("pianoboard_token", t.getToken());
			NewCookie uid_cookie = new NewCookie("pianoboard_uid", t.getAccountID());
			return filter.addCORS(Response.status(201).cookie(token_cookie, uid_cookie));
		} catch(IOException e) {
			return filter.addCORS(Response.status(409).entity(e.getMessage())); // Return conflict code (entity exists)
		}
	}

	/**
	 * READ
	 * ________________________________________________________________________
	 */
	@GET
	@Path("/{ID}")
	@Produces("application/json")
	public Response get(@PathParam("ID") String ID,
						@CookieParam("pianoboard_token") String token,
						@QueryParam("auth") boolean auth,
						@Context HttpServletRequestWrapper request) {

		System.out.println("GET REQUEST ON USERS PATH TO RETRIEVE DATA FROM USER ID " + ID);

		// If there was no token passed along with the request, just get the account as an unauthorized user
		if(token == null || !auth) {
			try {
				return filter.addCORS(Response.ok(activity.get(ID, false)));
			} catch(IOException e) {
				// The requested user ID does not exist
				return filter.addCORS(Response.status(404));
			}
		} else {
			String IP = getClientIp(request);
			try {
				// This function is void - if authentication fails, an exception is thrown
				activity.authenticateToken(ID, token, IP);
				// If authentication passes, attempt to get the user account as an authorized user
				return filter.addCORS(Response.ok(activity.get(ID, true)));
			} catch(IOException e) {
				// The requested user ID does not exist
				return filter.addCORS(Response.status(404));
			} catch(Exception e) {
				// If the token does not pass authentication, we just grab the account as an unauthorized user
				try {
					return filter.addCORS(Response.ok(activity.get(ID, false)));
				} catch(IOException ex) {
					// The requested user does not exist
					return filter.addCORS(Response.status(404));
				}
			}
		}
	}

	@GET
	@Produces("application/json")
	public Response search(@QueryParam("search") String query) {
		try {
			// Attempt to search for the provided query
			return filter.addCORS(Response.ok(activity.search(query)));
		} catch(IOException e) {
			// The account was not found so we return a not found status
			return filter.addCORS(Response.status(404));
		}
	}

	@GET
	@Path("/{ID}/{attribute}")
	@Produces("application/json")
	public Response getAttribute(@PathParam("ID") String ID, @PathParam("attribute") String attribute) {

		// We dont want anybody trying to get a password. Return a forbidden code
		if(attribute.contains("password")) return filter.addCORS(Response.status(405));

		try {
			// Attempt to log in to the given account with the provided credentials
			return filter.addCORS(Response.ok(activity.getAttribute(ID, attribute)));
		} catch(IOException e) {
			// The account was not found so we return a not found status
			return filter.addCORS(Response.status(404));
		}
	}

	/**
	 * UPDATE
	 * ________________________________________________________________________
	 */
	@PATCH
	@Path("/{ID}/{attribute}")
	@Consumes("text/plain")
	@Produces("application/json")
	public Response update(	@PathParam("ID") String ID,
							@PathParam("attribute") String attribute,
							@HeaderParam("authentication") String token,
							@QueryParam("action") String action,
							String data) {
		// TODO authorize token with ID then update attribute with data if authorization passes
		return filter.addCORS(Response.ok());
	}

	/**
	 * DELETE
	 * ________________________________________________________________________
	 */
	@DELETE
	@Path("/{ID}")
	@Produces("application/json")
	public Response delete(@PathParam("ID") String ID,
						   @HeaderParam("authorization") String token) {
		// TODO authorize token with ID then delete account
		return filter.addCORS(Response.ok());
	}
}
