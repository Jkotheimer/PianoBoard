package pianoboard.service.project;

import pianoboard.domain.project.Project;

import javax.ws.rs.core.Response;
import java.util.List;

public interface ProjectService {
	
	public Response getProjects();
	public Response getProject(String ID);
	public Response postProject(Project project);
	public Response putProject(Project project);
	public Response deleteProject(String ID);
}
