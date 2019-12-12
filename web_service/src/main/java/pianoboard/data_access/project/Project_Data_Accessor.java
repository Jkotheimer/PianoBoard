package pianoboard.data_access.project;

import java.util.List;
import java.util.Arrays;

import io.jsondb.annotation.Document;
import io.jsondb.annotation.Id;
import io.jsondb.annotation.Secret;

/**
 * Project_Data_Accessor class
 * 
 * This class will be used to create, read, update, and delete
 * project resourcesfrom the database using hibernate
 */
@Document(collection = "")
public class Project_Data_Accessor {
	
	public Project_Data_Accessor() {}
	
	/**
	 * CRUD METHODS
	 * ________________________________________________________________________
	 */
	
	public List<String> getAll() {
		return Arrays.asList("asdf", "qwer", "zxcv");
	}
	
	public String get(String ID) {
		// TODO: grab the project with the ID from the database
		return ID;
	}
	
	public int post(String userID, String ID, String projectJSON) {
		// TODO: push the given 3 fields to the database
		return 201;
	}
	
	public int put(String userID, String ID, String projectJSON) {
		// TODO: push the given 3 fields to the database
		return 201;
	}
	
	public int delete(String ID) {
		// TODO: delete the given id from the database
		return 200;
	}
}
