package pianoboard.data_access.project;

import java.util.List;
import java.util.ArrayList;
import java.io.File;
import java.io.IOException;

/**
 * Project_Data_Accessor class
 *
 * This class will be used to create, read, update, and delete
 * project resourcesfrom the database using jsondb
 */
//@Document(collection = "")
public class Project_Data_Accessor {

	public Project_Data_Accessor() {}

	/**
	 * CRUD METHODS
	 * ________________________________________________________________________
	 */

	public List<String> getAll (String userID) throws IOException {
		String path = "";
		for(char c : userID.toCharArray()) {
			path += c + "/";
		}
		File f = new File(path);
		System.out.println(f.getCanonicalPath());
		return new ArrayList<String>();
		// Go to the directory path that spells out the userID and parse all the project json files into strings and return the list
	}

	public String get(String userID, String ID) {
		// TODO: grab the project with the ID from the database
		String path = "";
		for(char c : userID.toCharArray()) {
			path += c + "/";
		}
		System.out.println(path + ID);
		return ID;
	}

	public int create(String userID, String ID, String projectJSON) {
		// TODO: push the given 3 fields to the database
		String path = "";
		for(char c : userID.toCharArray()) {
			path += c + "/";
		}
		System.out.println(path + ID + " --> " + projectJSON);
		return 201;
	}

	public String update(String userID, String ID, String projectJSON) {
		// TODO: push the given 3 fields to the database
		String path = "";
		for(char c : userID.toCharArray()) {
			path += c + "/";
		}
		System.out.println(path + ID + " --> " + projectJSON);
		return path;
	}

	public int delete(String userID, String ID) {
		// TODO: delete the given id from the database
		String path = "";
		for(char c : userID.toCharArray()) {
			path += c + "/";
		}
		System.out.println(path + ID);
		return 200;
	}
}
