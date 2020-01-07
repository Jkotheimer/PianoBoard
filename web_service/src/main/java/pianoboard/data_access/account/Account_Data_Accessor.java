package pianoboard.data_access.account;

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.io.IOException;

public class Account_Data_Accessor {

	public Account_Data_Accessor() {}

	public String get(String username) throws IOException {

		// Check to see if the user exists. If not, throw an exception
		File f = new File("pianoboard/database/" + username + "/account.json");
		if(!f.exists()) throw new IOException("Account with username " + username + " does not exist");

		// Read the contents of the file and return it as a string
		return Files.readString(f.toPath());
	}
	
	public List<String> search(String query) {
		return new ArrayList<String>();
	}

	public void create(String username, String accountJSON) throws IOException {

		// Check for an account with the given username. If it exists, throw an exception
		String path = "pianoboard/database/" + username + "/";
		File f = new File(path);
		if(f.exists()) throw new IOException("Account with username " + username + " already exists");
		f.mkdir();

		f = new File(path + "account.json");
		f.createNewFile();

		Files.writeString(f.toPath(), accountJSON);

		// Now that the account has been created, we make a projects directory to store the user's projects
		f = new File(path + "/projects/");
		f.mkdir();
	}
}
