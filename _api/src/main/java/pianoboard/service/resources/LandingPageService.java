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

import com.fasterxml.jackson.core.JsonProcessingException;
import java.io.IOException;

@Path("/")
public class LandingPageService extends Service {

	private final CORSFilter filter = new CORSFilter();
	private AccountActivity activity = new AccountActivity();

	public LandingPageService() {}

	@GET
	@Produces("text/plain")
	public String getApiInfo() {
		// TODO return html page regarding all documentation info for the api
		return "PIANOBOARD API DOCUMENTATION";
	}

	@POST
	@Consumes("application/json")
	@Produces("application/json")
	public Response createAccount(AuthenticationRequest a, HttpServletRequest request) {

		System.out.println("POST REQUEST TO ROOT: ACCOUNT CREATION INITIALIZED");

		String IP = getClientIp(request);
		try {
			return filter.addCORS(Response.status(201).entity(activity.create(a.getEmail(), a.getUsername(), a.getPassword(), IP)));
		} catch(IOException e) {
			System.out.println(e.getMessage());
			return filter.addCORS(Response.status(409).entity(e.getMessage())); // Return conflict code (entity exists)
		} catch(Exception e) {
			System.out.println(e.getMessage());
			return filter.addCORS(Response.status(500));  // Return server error code
		}
	}
}
