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

import java.util.List;
import java.util.Map;

import java.io.IOException;

@Path("/")
public class LandingPageService extends Service {

	private final CORSFilter filter = new CORSFilter();

	public LandingPageService() {}

	@GET
	@Produces("text/plain")
	public String getApiInfo() {
		// TODO return html page regarding all documentation info for the api
		return "PIANOBOARD API DOCUMENTATION";
	}
}