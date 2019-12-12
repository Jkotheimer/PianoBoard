package pianoboard.service.project;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.DELETE;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import java.util.List;
import java.net.URI;

import pianoboard.domain.project.Project;
import pianoboard.domain.project.ProjectManager;

@Path("/projects/")
public class ProjectServiceImpl implements ProjectService {
	
	private final ProjectManager manager = new ProjectManager();;
	
	public ProjectServiceImpl() {}
	
	@Override
	@GET
	public Response getProjects() {
		String projects = manager.get();
		GenericEntity<List<String>> entity = new GenericEntity<List<String>>(projects){};
		return Response.ok(entity).build();
	}
	@Override
	@GET
	@Path("/{ID}/")
	public Response getProject(@PathParam("ID") String ID) {
		//return Response.ok(new GenericEntity<Project>(manager.get(ID)){}, MediaType.APPLICATION_XML).build();
		return Response.status(Response.Status.OK).entity(manager.get(ID)).build();
	}
	
	@Override
	@POST
	public Response postProject(Project project) {
		return Response.ok().build();
	}
	
	@Override
	@PUT
	public Response putProject(Project project) {
		return Response.ok().build();
	}
	
	@Override
	@DELETE
	@Path("/{ID}/")
	public Response deleteProject(@PathParam("ID") String ID) {
		Response r = null;
		try {
			r = Response.seeOther(new URI("http://localhost:443/create_account")).build();
		} catch (java.net.URISyntaxException e) {}
		return r;
	}
}
