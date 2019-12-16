package pianoboard.service.Resources;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.DELETE;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

public class AccountService implements Service {

	private CORSFilter filter = new CORSFilter();

	@GET
	@Produces("application/json")
	public Response login(@QueryParam("username") String username, @QueryParam("password") String password) {

	}
}
