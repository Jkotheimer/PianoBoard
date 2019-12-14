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

import java.util.List;

import pianoboard.domain.project.Project;
import pianoboard.domain.project.ProjectManager;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.io.IOException;

@Path("/{userID}/projects")
public class ProjectService implements Service {

	private final ProjectManager manager = new ProjectManager();;
	private final CORSFilter filter = new CORSFilter();

	public ProjectService() {}

	/**
	 * Returns a list of Projects
	 */
	@GET
	@Produces("application/json")
	public Response getAll(@PathParam("userID") String userID) {
		try {
			List<Project> projects = manager.getAll(userID);
			return filter.addCORS(Response.ok(projects));
		} catch (JsonProcessingException e) {
			e.printStackTrace();
			return filter.addCORS(Response.status(500));
		} catch (IOException e) {
			return filter.addCORS(Response.status(405));
		}
	}

	/**
	 * Returns a single project
	 */
	@GET
	@Produces("application/json")
	@Path("/{projectName}")
	public Response get(@PathParam("userID") String userID, @PathParam("projectName") String projectName) {
		try {
			Project p = manager.get(userID, projectName);
			return filter.addCORS(Response.ok(p));
		} catch (JsonProcessingException e) {
			e.printStackTrace();
			return filter.addCORS(Response.status(500));
		} catch (IOException e) {
			return filter.addCORS(Response.status(404));
		}
	}

	/**
	 * Creates a new project and returns it
	 */
	@POST
	@Produces("application/json")
	public Response create(@PathParam("userID") String userID, @QueryParam("projectName") String projectName) {
		try {
			Project p = manager.create(userID, projectName);
			return filter.addCORS(Response.status(201).entity(p));
		} catch (JsonProcessingException e) {
			e.printStackTrace();
			return filter.addCORS(Response.status(500));
		} catch (IOException e) {
			return filter.addCORS(Response.status(404));
		}
	}

	/**
	 * Only returns a status
	 */
	@PUT
	@Path("/{ID}")
	@Consumes("application/json")
	public Response update(@PathParam("userID") String userID, @PathParam("ID") String ID, Project project) {
		try {
			manager.update(userID, ID, project);
			return filter.addCORS(Response.ok());
		} catch (JsonProcessingException e) {
			e.printStackTrace();
			return filter.addCORS(Response.status(500));
		} catch (IOException e) {
			return filter.addCORS(Response.status(404));
		}
	}

	/**
	 * Only returns a status
	 */
	@DELETE
	@Path("/{ID}/")
	public Response delete(@PathParam("userID") String userID, @PathParam("ID") String ID) {
		try {
			manager.delete(userID, ID);
			return filter.addCORS(Response.ok());
		} catch (IOException e) {
			return filter.addCORS(Response.status(404));
		}
	}

	@OPTIONS
	public Response options() {
		return filter.addCORS(Response.ok());
	}
}
