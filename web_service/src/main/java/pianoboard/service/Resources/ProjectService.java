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
import javax.ws.rs.core.Response;

import java.util.List;

import pianoboard.service.Activities.ProjectActivity;
import pianoboard.service.Representations.ProjectRepresentation;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.io.IOException;

@Path("/{userID}/projects")
public class ProjectService implements Service {

	private final ProjectActivity activity = new ProjectActivity();;
	private final CORSFilter filter = new CORSFilter();

	public ProjectService() {}

	/**
	 * Return a list of projects that belong to the given user
	 */
	@GET
	@Produces("application/json")
	public Response getAll(@PathParam("userID") String userID) {
		try {
			List<ProjectRepresentation> projects = activity.getAll(userID);
			return filter.addCORS(Response.ok(projects));
		} catch (JsonProcessingException e) {
			e.printStackTrace();
			return filter.addCORS(Response.status(500));
		} catch (IOException e) {
			e.printStackTrace();
			return filter.addCORS(Response.status(405));
		}
	}

	/**
	 * Return the project object that was queried
	 */
	@GET
	@Produces("application/json")
	@Path("/{projectName}")
	public Response get(@PathParam("userID") String userID, @PathParam("projectName") String projectName) {
		try {
			return filter.addCORS(Response.ok(activity.get(userID, projectName)));
		} catch (JsonProcessingException e) {
			e.printStackTrace();
			return filter.addCORS(Response.status(500));
		} catch (IOException e) {
			e.printStackTrace();
			return filter.addCORS(Response.status(404));
		}
	}

	/**
	 * Create a new project for the given user with the given name and return the object
	 */
	@POST
	@Produces("application/json")
	public Response create(@PathParam("userID") String userID, @QueryParam("projectName") String projectName) {
		try {
			return filter.addCORS(Response.status(201).entity(activity.create(userID, projectName)));
		} catch (JsonProcessingException e) {
			e.printStackTrace();
			return filter.addCORS(Response.status(500));
		} catch (IOException e) {
			e.printStackTrace();
			return filter.addCORS(Response.status(404));
		}
	}

	/**
	 * Patch the given project using the provided action, applying the given data
	 * Return the updated project object
	 */
	@PATCH
	@Path("/{name}")
	@Consumes("text/plain")
	@Produces("application/json")
	public Response update(@PathParam("userID") String userID, @PathParam("name") String name, @QueryParam("action") String action, String data) {
		try {
			return filter.addCORS(Response.ok(activity.update(userID, name, action, data)));
		} catch (JsonProcessingException e) {
			e.printStackTrace();
			return filter.addCORS(Response.status(500));
		} catch (IOException e) {
			e.printStackTrace();
			return filter.addCORS(Response.status(404));
		}
	}

	@POST
	@Path("/{name}/{track}/")
	@Consumes("application/json")
	@Produces("application/json")
	public Response addRecording(@PathParam("userID") String userID, @PathParam("name") String name, @PathParam("track") String track, String recording) {
		try {
			return filter.addCORS(Response.ok(activity.addRecording(userID, name, track, recording)));
		} catch (JsonProcessingException e) {
			e.printStackTrace();
			return filter.addCORS(Response.status(500));
		} catch (IOException e) {
			e.printStackTrace();
			return filter.addCORS(Response.status(404));
		}
	}

	/**
	 * Delete the given
	 */
	@DELETE
	@Path("/{name}/")
	public Response delete(@PathParam("userID") String userID, @PathParam("name") String name) {
		try {
			activity.delete(userID, name);
			return filter.addCORS(Response.ok());
		} catch (IOException e) {
			e.printStackTrace();
			return filter.addCORS(Response.status(404));
		}
	}

	/**
	 * This is called when delete is called to check for validity of the request
	 */
	@OPTIONS
	public Response options() {
		return filter.addCORS(Response.ok());
	}
}
