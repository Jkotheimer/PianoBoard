package pianoboard.service;

import pianoboard.service.project.*;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;

import java.io.IOException;
import java.net.URI;

@ApplicationPath("/")
public class Main extends Application {
	
	private static final String BASE_URI = "http://localhost:8080/";
	
	public static void main(String[] args) throws IOException {
		final HttpServer server = startServer();
		System.out.println("Server running at " + BASE_URI);
	}
	
	public static HttpServer startServer() {
		final ResourceConfig rc = new ResourceConfig().packages("pianoboard.service.project");
		return GrizzlyHttpServerFactory.createHttpServer(URI.create(BASE_URI), rc);
	}
}
